Handlebars.getTemplate = function(name) {
  if (Handlebars.templates === undefined || Handlebars.templates[name] === undefined) {
    return fetch('templates/' + name + '.handlebars')
      .then((response) => {
        if (response.ok) {
          return response.text();
        } else {
          return Promise.reject('something went wrong!')
        }
      })
      .then(data=>{
        if (Handlebars.templates === undefined) {
          Handlebars.templates = {};
        }
        Handlebars.templates[name] = Handlebars.compile(data);
        return Handlebars.templates[name];
      })
    } else {
      Promise.resolve(Handlebars.templates[name])
    }
};
