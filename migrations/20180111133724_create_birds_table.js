// defines the changes to the database
exports.up = function(knex, Promise) {
  return knex.schema.createTable('birds', (table) => {
    table.increments();
    table.string('title', 100).notNull();
    table.text('description');
    table.timestamps(true, true);
  });
};

// defines how to reverse the changes to the database
exports.down = function(knex, Promise) {
  return knex.schema.dropTable('birds');
};
