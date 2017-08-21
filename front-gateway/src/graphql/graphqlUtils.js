function updateHandler(query, dataFunc) {
  return (proxy, mutationResult) => {
    console.log(query);
    const previousData = proxy.readQuery({ query });
    const newData = dataFunc(previousData, mutationResult);
    proxy.writeQuery({ query, data: newData });
  };
}

module.exports = {
  updateHandler
};
