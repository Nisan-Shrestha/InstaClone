exports.seed = function(knex) {
  return knex('post_media').del()
    .then(function () {
      return knex('post_media').insert([
        { id: '83c1b9f0-7467-4cd2-abd9-845fd26a9a59', post_id: 'f4458277-496c-443f-9a2d-514ac5973114', order: 0, media_url: 'https://res.cloudinary.com/dubczuwos/image/upload/v1722782269/post_media/jejuwzengs3hjofcqqfh.png' },
        { id: 'f84c9cde-af8a-4e5f-8d48-959396a7be8c', post_id: 'f4458277-496c-443f-9a2d-514ac5973114', order: 1, media_url: 'https://res.cloudinary.com/dubczuwos/image/upload/v1722782270/post_media/tazsx1rrwjcgxdchcv3o.png' },
        { id: 'b879f819-781d-4ab9-aba9-61139d8a0957', post_id: 'd9bc5c3f-e76f-46cc-9fce-4ca7a7320c6f', order: 0, media_url: 'https://res.cloudinary.com/dubczuwos/image/upload/v1722782301/post_media/ueput1tte9bc5ulsticl.png' },
        { id: '019db17e-0db8-4780-9858-6a4f615a178e', post_id: 'cc28e7ea-5819-444f-ad32-cf278d538e92', order: 0, media_url: 'https://res.cloudinary.com/dubczuwos/image/upload/v1722782533/post_media/nra9hdpm0kf5m08lbfnt.png' },
        { id: '9d65a491-c040-475a-b38b-26bd3a289f53', post_id: 'cc28e7ea-5819-444f-ad32-cf278d538e92', order: 1, media_url: 'https://res.cloudinary.com/dubczuwos/image/upload/v1722782566/post_media/igivllce8vbwri4ws75l.png' },
        { id: '482d6a40-a12c-4e61-86a0-d85659fb029b', post_id: 'a6492d29-959e-489b-a07f-07d3e3b68e98', order: 0, media_url: 'https://res.cloudinary.com/dubczuwos/image/upload/v1722782722/post_media/zef572ufqapku9uc5aoc.png' },
        { id: 'b2d6531c-da5e-4db1-b6b2-ff5876c5fd5f', post_id: 'fe6b338e-458c-442f-a0f5-27a69b5a0999', order: 0, media_url: 'https://res.cloudinary.com/dubczuwos/image/upload/v1722782835/post_media/g59wsosssqbtcjcj3rzu.png' },
        { id: '5b9d98d1-bec0-4007-b87a-4884ed0e8c25', post_id: 'f7222c42-27a1-4df8-9eb4-c7231ebef875', order: 0, media_url: 'https://res.cloudinary.com/dubczuwos/image/upload/v1722782933/post_media/dpf8f8zclcautiewulq5.png' },
        { id: '7a0343a4-ac49-47d0-a6e9-2e2c031b4a4d', post_id: 'f7222c42-27a1-4df8-9eb4-c7231ebef875', order: 1, media_url: 'https://res.cloudinary.com/dubczuwos/image/upload/v1722782936/post_media/whk7aklfzg232s8o2e6y.png' },
        { id: '14d8a840-5eff-407a-9ec6-0f82f58011b3', post_id: '54b6f952-f0eb-4e58-8e08-6c7c1acdaa07', order: 0, media_url: 'https://res.cloudinary.com/dubczuwos/image/upload/v1722782962/post_media/xotyp3cioghuhfsnnlhi.png' },
        { id: '129e7ef9-915d-4d7e-8996-f130568af901', post_id: '03d1f1e0-433f-494a-b91d-59dd511e7dcf', order: 0, media_url: 'https://res.cloudinary.com/dubczuwos/image/upload/v1722782978/post_media/jwd7w7jrhmzh8qxk4bx7.png' }
      ]);
    });
};