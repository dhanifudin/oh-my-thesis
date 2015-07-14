-- vim: set foldmethod=marker:

/* Users {{{ */
INSERT INTO `user` (`id`, `username`, `name`)
  VALUES(1, 'publisher1', 'Publisher 1');
INSERT INTO `user` (`id`, `username`, `name`)
  VALUES(2, 'publisher2', 'Publisher 2');
INSERT INTO `user` (`id`, `username`, `name`)
  VALUES(3, 'publisher3', 'Publisher 3');
INSERT INTO `user` (`id`, `username`, `name`)
  VALUES(4, 'publisher4', 'Publisher 4');
INSERT INTO `user` (`id`, `username`, `name`)
  VALUES(5, 'publisher5', 'Publisher 5');
INSERT INTO `user` (`id`, `username`, `name`)
  VALUES(6, 'publisher6', 'Publisher 6');
INSERT INTO `user` (`id`, `username`, `name`)
  VALUES(7, 'publisher7', 'Publisher 7');
INSERT INTO `user` (`id`, `username`, `name`)
  VALUES(8, 'publisher8', 'Publisher 8');
INSERT INTO `user` (`id`, `username`, `name`)
  VALUES(9, 'publisher9', 'Publisher 9');
INSERT INTO `user` (`id`, `username`, `name`)
  VALUES(10, 'publisher10', 'Publisher 10');

INSERT INTO `user` (`id`, `username`, `name`)
  VALUES(11, 'subscriber1', 'Subscriber 1');
INSERT INTO `user` (`id`, `username`, `name`)
  VALUES(12, 'subscriber2', 'Subscriber 2');
INSERT INTO `user` (`id`, `username`, `name`)
  VALUES(13, 'subscriber3', 'Subscriber 3');
INSERT INTO `user` (`id`, `username`, `name`)
  VALUES(14, 'subscriber4', 'Subscriber 4');
INSERT INTO `user` (`id`, `username`, `name`)
  VALUES(15, 'subscriber5', 'Subscriber 5');
INSERT INTO `user` (`id`, `username`, `name`)
  VALUES(16, 'subscriber6', 'Subscriber 6');
INSERT INTO `user` (`id`, `username`, `name`)
  VALUES(17, 'subscriber7', 'Subscriber 7');
INSERT INTO `user` (`id`, `username`, `name`)
  VALUES(18, 'subscriber8', 'Subscriber 8');
INSERT INTO `user` (`id`, `username`, `name`)
  VALUES(19, 'subscriber9', 'Subscriber 9');
INSERT INTO `user` (`id`, `username`, `name`)
  VALUES(20, 'subscriber10', 'Subscriber 10');
/* }}} Users */

/* Relationships {{{ */
INSERT INTO `relationship` (`relation_from`, `relation_to`, `relation_level`)
  VALUES(11, 2, 1);
INSERT INTO `relationship` (`relation_from`, `relation_to`, `relation_level`)
  VALUES(12, 1, 2);
/* }}} Relationships */
