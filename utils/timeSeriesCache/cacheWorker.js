// cache service

module.exports = (provider) => {
  // provider here is an abstraction of redis or a memory cache

  const saveItem = (key, item) => {
    provider.save(key, item);
  };

  const getItem = (key) => {
    provider.get(key);
  };

  return {
    saveItem,
    getItem,
  };
};
