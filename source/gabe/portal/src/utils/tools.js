export function append(container, text) {
  if (typeof text === "object") {
    container.appendChild(text);
    return;
  }
  let box = document.createElement("div");
  let frag = document.createDocumentFragment();
  box.innerHTML = text;
  while (box.firstElementChild) {
    frag.appendChild(box.firstElementChild);
  }
  container.appendChild(frag);
}

export const copy = async (data) => {
  try {
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(data);
    } else {
      throw new Error("");
    }
  } catch (error) {
    const textarea = document.createElement("textarea");
    textarea.value = data;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    document.body.removeChild(textarea);
  }
};

export const copyBlock = (node) => {
  var range;
  if (document.body.createTextRange) {
    range = document.body.createTextRange();
    range.moveToElementText(node);
    range.select();
    document.execCommand("copy");
  } else if (window.getSelection) {
    var selection = window.getSelection();
    range = document.createRange();
    range.selectNodeContents(node);
    selection.removeAllRanges();
    selection.addRange(range);
    document.execCommand("copy");
  } else {
    console.log("wrong");
  }
};

export const randomString = (value) => {
  const e = value || 32;
  let t = "ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678",
    a = t.length,
    n = "";
  for (let i = 0; i < e; i++) n += t.charAt(Math.floor(Math.random() * a));
  return n;
};

export const once = (func) => {
  var ran = false,
    memo;
  return function () {
    if (ran) return memo;
    ran = true;
    memo = func.apply(this, arguments);
    func = null;
    return memo;
  };
};
