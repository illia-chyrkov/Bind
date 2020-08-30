import Bind from "./Bind.js";

const bind = new Bind({
  container: "#form", // 'body' by default
  data: {
    // may be empty, used to specify default values
    firstName: "John",
    lastName: "Doe"
  },
  computed: {
    isFormValid({ firstName, lastName }) {
      if (firstName.length > 0 && lastName.length > 0) return "Form is valid";
      return "Form is invalid";
    }
  },
  onChange(key, value) {
    console.log(
      `${
        key === "firstName" ? "First" : "Last"
      } name was changed. New value: ${value}`
    );
  }
});

bind.lastName = "Smith";
