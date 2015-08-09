Template.registerHelper("print", function (object) {
  console.log(object);
});

Template.registerHelper("isPhone", function () {
  return Meteor.Device.isPhone();
});

Blaze.TemplateInstance.prototype.parentTemplate = function (levels) {
  var view = Blaze.currentView;
  if (typeof levels === "undefined") {
    levels = 1;
  }
  while (view) {
    if (view.name.substring(0, 9) === "Template." && !(levels--)) {
      return view.templateInstance();
    }
    view = view.parentView;
  }
};
