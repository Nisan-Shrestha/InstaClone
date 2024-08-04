exports.seed = function(knex) {
  return knex('hashtags').del()
    .then(function () {
      return knex('hashtags').insert([
        { id: 'f757d3d6-35fa-4c66-bfdf-9780c7cf125d', name: 'party' },
        { id: 'ff821689-8357-40ff-a44b-6f9719e42484', name: 'stars' },
        { id: '68f09917-7545-4285-acc5-9a83457967e3', name: 'dream' },
        { id: '1c1c3a0e-e846-4ab9-a232-894d5b189eac', name: 'cantwaittogoback' },
        { id: 'bba882b3-26ed-493b-905b-473e47f280e5', name: 'nabin' },
        { id: '755994d1-da72-43e4-8457-f69b04a6ec70', name: 'leapfrog' },
        { id: '52bacd89-36b5-4143-b43d-a115ae2a387f', name: 'memories' },
        { id: '7632edd6-bfbb-48cd-9571-7b9c73f6a5b3', name: 'spark' }
      ]);
    });
};