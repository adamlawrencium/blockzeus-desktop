export default function fetchPoloniexData() {
  return new Promise((resolve, reject) => {
    fetch('/poloniexData/ticker')
      .then(res => res.json())
      .then(data => {
        resolve(data);
      });
  })
}