exports.seed = function (knex) {
  return knex("saved_posts")
    .del()
    .then(function () {
      return knex("saved_posts").insert([
        {
          id: "fde3554f-2897-452e-9485-dc55da7d8fe7",
          post_id: "f4458277-496c-443f-9a2d-514ac5973114",
          user_id: "5aaa3757-924d-4e70-8fa5-3cbdaf1795d5",
          created_at: "2024-08-04 14:46:22.705+00",
        },
      ]);
    });
};