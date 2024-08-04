exports.seed = function(knex) {
  return knex('likes').del()
    .then(function () {
      return knex('likes').insert([
        {
          id: 'a785ad7c-c87b-4899-8367-7fd9e9717b5e',
          post_id: 'd9bc5c3f-e76f-46cc-9fce-4ca7a7320c6f',
          user_id: '5aaa3757-924d-4e70-8fa5-3cbdaf1795d5',
          created_at: '2024-08-04 14:46:20.845+00'
        }
      ]);
    });
};