export function validPassword(val) {
  let pwdRegex = new RegExp("(?=.*[0-9])(?=.*[a-zA-Z]).{8,30}");
  if (val.length < 8) {
    return $t("passwordLengthShort");
  } else if (val.length > 30) {
    return $t("passwordLengthLong");
  }
  if (pwdRegex.test(val)) {
    return null;
  } else {
    return $t("passwordRequireLetterAndDigit");
  }
}

export function validEmail(val) {
  return /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(val)
    ? null
    : $t("emailInvalid");
}

export function validIdcard(val) {
  return /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(val)
    ? null
    : $t("idcardInvalid");
}

export function validPhone(val) {
  return /^[1][0-9][0-9]{9}$/.test(val) ? null : $t("phoneInvalid");
}
