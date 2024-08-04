exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex("users")
    .del()
    .then(function () {
      // Inserts seed entries
      return knex("users").insert([
        {
          id: "fc1842d1-b432-47b8-af59-98fdd3442ca0",
          username: "nisan",
          name: "Nisan Shrestha",
          email: "nisanshrestha404@gmail.com",
          role: "Regular",
          privacy: "Public",
          pfp_url:
            "https://lh3.googleusercontent.com/a/ACg8ocJHBcOeeEnplDUf4ud_sCayb0nK3COqQWnRCbBlDNZ2KJG3WgKL=s96-c",
          created_at: "2024-08-04 14:13:11.208+00",
          updated_at: "2024-08-04 14:13:11.259+00",
        },
        {
          id: "5aaa3757-924d-4e70-8fa5-3cbdaf1795d5",
          username: "akamark",
          name: "Nisan Shrestha",
          email: "martsmagicalmess@gmail.com",
          password:
            "$2a$10$0YseCDeVrKhyCbhh9AoaDui1yO8ulpmzZ1Mn9Z6IUbfoW1vS0C7WW",
          role: "Regular",
          privacy: "Private",
          pfp_url:
            "https://res.cloudinary.com/dubczuwos/image/upload/v1722781079/post_media/emqyne6qeq5swyqnsk6i.png",
          created_at: "2024-08-04 14:17:37.159+00",
          updated_at: "2024-08-04 14:18:13.876+00",
        },
        {
          id: "5a14dcfd-3d89-4ecb-914d-e11c5ff99878",
          username: "busyboi",
          name: "Bijen Shrestha",
          email: "mortality077@gmail.com",
          password:
            "$2a$10$2.CeDWG0mwgltP8H99aiq.qBCzdQhXeh3RtLMZBQlwJpOhjtjCtXe",
          role: "Regular",
          privacy: "Public",
          pfp_url:
            "https://res.cloudinary.com/dubczuwos/image/upload/v1722782217/post_media/ijat0leco07m2gowcatl.png",
          bio: "I am Bijen Shrestha, a fellow @leapfrogtech",
          created_at: "2024-08-04 14:21:43.734+00",
          updated_at: "2024-08-04 14:37:13.525+00",
        },
        {
          id: "5a99850b-f0a2-4ef2-99b1-463c79c3be91",
          username: "nabin",
          name: "Nisan Shrestha",
          email: "nisantheman@gmail.com",
          role: "Regular",
          privacy: "Public",
          pfp_url:
            "https://lh3.googleusercontent.com/a/ACg8ocIXNfi9phFYzm96nNGEU9BLNba6-qhMJTURrK5HvpTRB9Xawidtgw=s96-c",
          bio: "I am another persona of Nisan",
          created_at: "2024-08-04 14:13:41.663+00",
          updated_at: "2024-08-04 14:49:49.19+00",
        },
      ]);
    });
};
