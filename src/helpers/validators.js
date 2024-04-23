const firstLetterCapital = (string) => {
    const firstLetter = string[0].toUpperCase() + string.slice(1);
    return firstLetter;
  };
  const validatePassword = (password) => {
    const re = /^(?=.*\d).{6,}$/;
    return re.test(password);
  };

  export {firstLetterCapital,validatePassword};