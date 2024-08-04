exports.seed = function(knex) {
  return knex('post_hastags').del()
    .then(function () {
      return knex('post_hastags').insert([
        { id: 'bf1655a5-815a-42f2-964b-1340256d57ca', post_id: 'f4458277-496c-443f-9a2d-514ac5973114', hashtag_id: 'f757d3d6-35fa-4c66-bfdf-9780c7cf125d' },
        { id: 'fc924474-88fc-4897-ac5a-5de65d45672f', post_id: 'd9bc5c3f-e76f-46cc-9fce-4ca7a7320c6f', hashtag_id: 'ff821689-8357-40ff-a44b-6f9719e42484' },
        { id: 'b273d1c8-9edb-468d-ad62-243737a09689', post_id: 'cc28e7ea-5819-444f-ad32-cf278d538e92', hashtag_id: '68f09917-7545-4285-acc5-9a83457967e3' },
        { id: '73553371-fbac-4f8d-b4d8-55b43557385e', post_id: 'cc28e7ea-5819-444f-ad32-cf278d538e92', hashtag_id: '1c1c3a0e-e846-4ab9-a232-894d5b189eac' },
        { id: 'bb0b5fb0-20f2-48ce-b5fd-2ddbaf5a8b53', post_id: 'a6492d29-959e-489b-a07f-07d3e3b68e98', hashtag_id: 'bba882b3-26ed-493b-905b-473e47f280e5' },
        { id: '90b2dc21-79af-45f6-a8a7-47de8c854a49', post_id: 'a6492d29-959e-489b-a07f-07d3e3b68e98', hashtag_id: '755994d1-da72-43e4-8457-f69b04a6ec70' },
        { id: '440c952c-2c32-4be6-ad4e-423030a6577e', post_id: 'f7222c42-27a1-4df8-9eb4-c7231ebef875', hashtag_id: '52bacd89-36b5-4143-b43d-a115ae2a387f' },
        { id: '4d1c5cb7-442f-4c7a-851f-cb890e77791c', post_id: '03d1f1e0-433f-494a-b91d-59dd511e7dcf', hashtag_id: '7632edd6-bfbb-48cd-9571-7b9c73f6a5b3' }
      ]);
    });
};