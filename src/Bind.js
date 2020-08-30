export default class Bind {
  constructor(options = {}) {
    this.$container = options.container || "body";
    this.$data = options.data || {};
    this.$computed = options.computed || {};
    this.$onChange = options.onChange || (() => {});

    this.$modelElements = Array.from(
      document.querySelector(this.$container).querySelectorAll("[bind-model]")
    );
    this.$valueElements = Array.from(
      document.querySelector(this.$container).querySelectorAll("[bind-value]")
    );
    this.$computedElements = Array.from(
      document
        .querySelector(this.$container)
        .querySelectorAll("[bind-computed]")
    );

    this.$proxy = new Proxy(this.$data, {
      set: (obj, prop, value) => {
        obj[prop] = value;

        this.$modelElements.forEach(($element) => {
          const key = $element.getAttribute("bind-model");
          if (key === prop) $element.value = this.$data[key];
        });

        this.$valueElements.forEach(($element) => {
          /* eslint-disable no-new-func */
          const value = new Function(
            ...Object.keys(this.$data),
            `return \`${$element.getAttribute("bind-value")}\`;`
          )(...Object.values(this.$data));

          $element.innerText = value;
        });

        this.$computedElements.forEach(($element) => {
          const key = $element.getAttribute("bind-computed");
          $element.innerText = this.$computed[key](this.$data);
        });

        this.$onChange(prop, value);

        return true;
      }
    });

    this.$modelElements.forEach((i) => this.initDefaultData.call(this, i));

    this.$modelElements.forEach(($element) => {
      $element.addEventListener("input", () => {
        this.$proxy[$element.getAttribute("bind-model")] = $element.value;
      });

      const key = $element.getAttribute("bind-model");
      $element.value = this.$data[key];
    });

    this.$valueElements.forEach(($element) => {
      /* eslint-disable no-new-func */
      const value = new Function(
        ...Object.keys(this.$data),
        `return \`${$element.getAttribute("bind-value")}\`;`
      )(...Object.values(this.$data));

      $element.innerText = value;
    });

    this.$computedElements.forEach(($element) => {
      const key = $element.getAttribute("bind-computed");
      $element.innerText = this.$computed[key](this.$data);
    });

    return this.$proxy;
  }

  initDefaultData($element) {
    let attrs = $element.attributes;

    for (let i = 0; i < attrs.length; i++) {
      let attr = attrs[i].name;
      let key = attrs[i].value;

      if (attr.startsWith("bind-")) {
        if (typeof this.$data[key] === "undefined") this.$data[key] = "";
      }
    }
  }
}
