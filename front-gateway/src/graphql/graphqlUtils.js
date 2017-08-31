function updateHandler(query, dataFunc) {
  return (proxy, mutationResult) => {
    const previousData = proxy.readQuery({ query });
    const newData = dataFunc(previousData, mutationResult);
    proxy.writeQuery({ query, data: newData });
  };
}

module.exports = {
  updateHandler
};
