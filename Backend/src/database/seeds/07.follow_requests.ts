exports.seed = function(knex) {
  return knex('follow_requests').del()
    .then(function () {
      return knex('follow_requests').insert([
        {
          id: '3cb6105a-ffc6-4773-9cc5-de667d297331',
          requester_id: '5a99850b-f0a2-4ef2-99b1-463c79c3be91',
          requested_id: '5aaa3757-924d-4e70-8fa5-3cbdaf1795d5',
          status: 'Pending',
          created_at: '2024-08-04 14:50:02.593+00'
        }
      ]);
    });
};