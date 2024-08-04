exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex("posts")
    .del()
    .then(function () {
      // Inserts seed entries
      return knex("posts").insert([
        {
          id: "f4458277-496c-443f-9a2d-514ac5973114",
          user_id: "5a14dcfd-3d89-4ecb-914d-e11c5ff99878",
          caption: "this is #party life.",
          created_at: "2024-08-04 14:37:48.003+00",
        },
        {
          id: "d9bc5c3f-e76f-46cc-9fce-4ca7a7320c6f",
          user_id: "5a14dcfd-3d89-4ecb-914d-e11c5ff99878",
          caption: "#stars make me dream.",
          created_at: "2024-08-04 14:38:18.57+00",
        },
        {
          id: "cc28e7ea-5819-444f-ad32-cf278d538e92",
          user_id: "5aaa3757-924d-4e70-8fa5-3cbdaf1795d5",
          caption: "Mardi was a #dream. \r\n\r\n#cantwaittogoback",
          created_at: "2024-08-04 14:42:11.906+00",
        },
        {
          id: "a6492d29-959e-489b-a07f-07d3e3b68e98",
          user_id: "5aaa3757-924d-4e70-8fa5-3cbdaf1795d5",
          caption: "This is #nabin at #leapfrog",
          created_at: "2024-08-04 14:45:20.609+00",
        },
        {
          id: "fe6b338e-458c-442f-a0f5-27a69b5a0999",
          user_id: "fc1842d1-b432-47b8-af59-98fdd3442ca0",
          caption:
            "Puzzles. 🧩\r\n\r\nA puzzle that puzzles my heart,\r\nLike a piece that was never mine.\r\nBut you try to force it in,\r\nOnly to realize its not meant?\r\nFuck that!\r\nI'll carve out a hole!\r\nThrough the heart, the earth, the entire world.\r\nCurse all that comes in between.\r\nI'll tear everything down.\r\nOnly if the puzzle would fit.\r\nOnly if the puzzle pieces would fit.",
          created_at: "2024-08-04 14:47:14.246+00",
        },
        {
          id: "f7222c42-27a1-4df8-9eb4-c7231ebef875",
          user_id: "5a99850b-f0a2-4ef2-99b1-463c79c3be91",
          caption:
            "#memories make moments magical. \r\n\r\nor is it the other way?",
          created_at: "2024-08-04 14:48:50.976+00",
        },
        {
          id: "54b6f952-f0eb-4e58-8e08-6c7c1acdaa07",
          user_id: "5a99850b-f0a2-4ef2-99b1-463c79c3be91",
          caption: "Ma guras liyera auchu",
          created_at: "2024-08-04 14:49:20.347+00",
        },
        {
          id: "03d1f1e0-433f-494a-b91d-59dd511e7dcf",
          user_id: "5a99850b-f0a2-4ef2-99b1-463c79c3be91",
          caption: "do you have that #spark in you?",
          created_at: "2024-08-04 14:49:36.587+00",
        },
      ]);
    });
};
