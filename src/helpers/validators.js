const firstLetterCapital = (string) => {
    const firstLetter = string[0].toUpperCase() + string.slice(1);
    return firstLetter;
  };
  const validatePassword = (password) => {
    const re = /^(?=.*\d).{6,}$/;
    return re.test(password);
  };

  const validateEmail = (email) => {
    const re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email);
  };

  export {firstLetterCapital,validatePassword,validateEmail};