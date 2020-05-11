module.exports = {
  options: {
	appendPlugins: ["postgraphile-plugin-connection-filter"],
    connection: "postgres://postgres:7898@localhost:5432/for_ali",
	cors: true,
	watch: true
  },
};