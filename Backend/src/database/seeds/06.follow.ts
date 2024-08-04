exports.seed = function(knex) {
  return knex('follow').del()
    .then(function () {
      return knex('follow').insert([
        {
          id: '5056c09d-a9ed-4e0a-b423-05552efe2f9d',
          follower_id: '5aaa3757-924d-4e70-8fa5-3cbdaf1795d5',
          following_id: 'fc1842d1-b432-47b8-af59-98fdd3442ca0',
          created_at: '2024-08-04 14:18:08.753+00'
        },
        {
          id: 'be63a564-c868-45d5-9903-286089c172f5',
          follower_id: '5aaa3757-924d-4e70-8fa5-3cbdaf1795d5',
          following_id: '5a99850b-f0a2-4ef2-99b1-463c79c3be91',
          created_at: '2024-08-04 14:18:09.369+00'
        },
        {
          id: '3c995947-5ffe-483d-bcb6-c6e8238557aa',
          follower_id: '5aaa3757-924d-4e70-8fa5-3cbdaf1795d5',
          following_id: '5a14dcfd-3d89-4ecb-914d-e11c5ff99878',
          created_at: '2024-08-04 14:46:12.204+00'
        },
        {
          id: 'c021b3d8-0cc4-4294-8aea-54e29a79a437',
          follower_id: 'fc1842d1-b432-47b8-af59-98fdd3442ca0',
          following_id: '5a14dcfd-3d89-4ecb-914d-e11c5ff99878',
          created_at: '2024-08-04 14:47:52.664+00'
        }
      ]);
    });
};