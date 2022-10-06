const container = document.querySelector(".container");
const iptContainer = document.querySelector(".ipt-container");

const host = 'https://hdy.gh520.xyz';
// const host = 'http://127.0.0.1:8080';
// const host = 'http://164.88.255.3:8070';

function dragOver(e) {
  e.preventDefault();
}
function drop(e) {
  e.preventDefault();
  const file = e.dataTransfer.files[0];
  uploadAndUpdate(file);
}
function change() {
  const file = this.files[0];
  uploadAndUpdate(file);
}
const uploadAndUpdate = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  const { filename } = await fetch(`${host}/api/uploadFile`, {
    method: "POST",
    body: formData,
  }).then(res => res.ok ? res.json() : {});
  if (filename) {
    const img = document.createElement("img");
    img.src = `${host}/files/${filename}`;
    container.appendChild(img);
  }
}

iptContainer.addEventListener("dragover", dragOver);
iptContainer.addEventListener("drop", drop);
iptContainer.addEventListener("change", change);