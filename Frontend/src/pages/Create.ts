// import { fetchView } from "../utils/utils";
import "cropperjs/dist/cropper.css";
import { router } from "../main";
import { fetchView, request } from "../utils/utils";
import Cropper from "cropperjs";

interface Image {
  file: File;
  preview: string;
  cropper?: Cropper;
}
export class Create {
  public static async load() {
    if (
      !window.history.state ||
      window.history.state.currentView != "homeView"
    ) {
      let view = await fetchView("/views/Home.html");
      document.getElementById("app")!.innerHTML = view;
      window.history.replaceState(
        { ...window.history.state, currentView: "homeView" },
        "",
      );
    }
    // if (window.history.state.currentTab != "homeFeed") {
    //   document.getElementById("mainContainer")!.innerHTML = "";
    //   window.history.replaceState(
    //     { ...window.history.state, currentTab: "homeFeed" },
    //     "",
    //   );
    // }
    // window.history.replaceState(
    //   { ...window.history.state, currentTab: "homeFeed" },
    //   "",
    // );

    let newPost = await fetchView("/component/Create.html");
    let container = document.createElement("div");
    container.setAttribute("class", "w-6/12 max-w-xl min-w-64");
    container.innerHTML = newPost;
    // return;
    const FeedContainer = document.getElementById("mainContainer");
    FeedContainer?.appendChild(container);

    this.setup();
  }
  static setup() {
    let imageUpload = document.getElementById(
      "image-upload",
    ) as HTMLInputElement;
    const images: Image[] = [];

    document
      .getElementById("close-modal")
      ?.addEventListener("click", () => this.closeModal());
    // document.getElementById('addImages')?.addEventListener('click', () => this.imageUpload.click());
    imageUpload.addEventListener("change", (e) =>
      this.handleImageUpload(e, images),
    );
    document
      .getElementById("submit-post")
      ?.addEventListener("click", () => this.submitPost(images));
  }

  static closeModal() {
    if (!window.history.state.currentTab)
      router.navigate("/", window.history.state);
    else window.history.back();
  }

  static handleImageUpload(event: Event, images: Image[]) {
    const files = (event.target as HTMLInputElement).files;
    if (files) {
      Array.from(files).forEach((file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const preview = e.target?.result as string;
          const image: Image = {
            file,
            preview,
          };
          images.push(image);
          this.renderImagePreview(images);
        };
        reader.readAsDataURL(file);
      });
    }
  }

  static renderImagePreview(images: Image[]) {
    let imagePreview = document.getElementById("image-preview") as HTMLElement;
    imagePreview.innerHTML = "";
    images.forEach((image, index) => {
      const wrapper = document.createElement("div");
      wrapper.className = "relative inline-block mr-2 mb-2";

      const img = document.createElement("img");
      img.src = image.preview;
      img.className = "w-48 h-48 object-cover rounded";
      img.addEventListener("click", () => this.openCropper(images, index));

      const removeBtn = document.createElement("button");
      removeBtn.innerHTML = "&times;";
      removeBtn.className =
        "absolute top-0 right-0 bg-white rounded-full p-1 shadow";
      removeBtn.addEventListener("click", () => {
        images.splice(index, 1);
        this.renderImagePreview(images);
      });

      wrapper.appendChild(img);
      wrapper.appendChild(removeBtn);
      imagePreview.appendChild(wrapper);
    });
  }

  static openCropper(images: Image[], index: number) {
    let image = images[index];
    const cropperModal = document.createElement("div");
    cropperModal.className =
      "fixed inset-0 bg-black bg-opacity-50  items-center justify-center max-h-[75%] max-w-[75%] m-auto";

    const cropperWrapper = document.createElement("div");
    cropperWrapper.className =
      "mx-auto bg-white rounded h-[100%] w-auto  aspect-square border-blue-500 border-8 border-solid";

    const cropperImg = document.createElement("img");
    cropperImg.className =
      "block hidden  w-full  border-red-500 border-8 border-solid hidden";
    cropperImg.src = image.preview;

    const confirmBtn = document.createElement("button");
    confirmBtn.textContent = "Confirm Crop";
    confirmBtn.className =
      "fixed top-0 mt-4 bg-blue-500 text-white px-4 py-2 rounded";

    cropperWrapper.appendChild(cropperImg);
    cropperWrapper.prepend(confirmBtn);
    cropperModal.appendChild(cropperWrapper);
    document.body.appendChild(cropperModal);

    const cropper = new Cropper(cropperImg, {
      aspectRatio: 1,
      viewMode: 2,
      modal: true,
    });

    confirmBtn.addEventListener("click", () => {
      const croppedCanvas = cropper.getCroppedCanvas();
      image.preview = croppedCanvas.toDataURL();
      this.renderImagePreview(images);
      document.body.removeChild(cropperModal);
    });
  }

  static async submitPost(images: Image[]) {
    let captionInput = document.getElementById(
      "caption",
    ) as HTMLTextAreaElement;
    const caption = captionInput.value;
    const formData = new FormData();

    await Promise.all(
      images.map(async (image, index) => {
        // if (aspectRatio != 1) {
        let croppedBlob = await this.cropToSquare(image.preview);
        // image.preview = croppedPreview;
        // }

        if (croppedBlob) formData.append(`photo`, croppedBlob, `image${index}`);
        else console.log("error");
        return;
      }),
    );
    formData.append("caption", caption);
    console.log(
      "Submitting post with images and caption:",
      [...formData.keys()],
      formData.get("photo"),
      // formData.keys,
    );

    const res = request({
      url: import.meta.env.VITE_BACKEND_URL + "/posts/upload",
      method: "POST",
      body: formData,
      // headers: {
      //   "Content-Type": "multipart/form-data",
      // },
      other: { contentType: "multipart/form-data" },
    });

    let btn = document.getElementById("submit-post") as HTMLButtonElement;
    btn.innerText = "Uploading...";
    btn.disabled = true;
    btn.classList.remove("bg-blue-500", "hover:bg-blue-600");
    btn.classList.add("bg-gray-500");
    // Reset form after submission
    let result = await res;
    if (result.status != "success") {
      btn.innerText = "Publish";
      btn.disabled = false;
      btn.classList.add("bg-blue-500", "hover:bg-blue-600");
      btn.classList.remove("bg-gray-500");
      alert("Error uploading post");
      console.log("Error uploading post");
      return;
    }
    images = [];
    captionInput.value = "";
    this.renderImagePreview(images);
    alert("Post uploaded successfully");
    this.closeModal();
  }

  static async getImageAspectRatio(dataUrl: string): Promise<number> {
    const img = new Image();
    img.src = dataUrl;
    await img.decode();
    const aspectRatio = img.width / img.height;
    return aspectRatio;
  }

  static async cropToSquare(imageData: string) {
    const img = new Image();
    img.src = imageData;
    await img.decode();

    const minDimension = Math.min(img.width, img.height);
    const canvas = document.createElement("canvas");
    canvas.width = minDimension;
    canvas.height = minDimension;
    const ctx = canvas.getContext("2d");

    if (!ctx) return null;

    const startX = (img.width - minDimension) / 2;
    const startY = (img.height - minDimension) / 2;
    ctx.drawImage(
      img,
      startX,
      startY,
      minDimension,
      minDimension,
      0,
      0,
      minDimension,
      minDimension,
    );

    const imageBlob = new Promise<Blob | null>((resolve) => {
      canvas.toBlob((blob) => {
        resolve(blob);
      });
    });

    return await imageBlob;
  }
}
