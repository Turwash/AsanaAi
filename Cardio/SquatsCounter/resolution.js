let width, height, point_width;

if (navigator.mediaDevices.getUserMedia) {
  navigator.mediaDevices
    .getUserMedia({ video: true })
    .then((stream) => {
      let stream_settings = stream.getVideoTracks()[0].getSettings();
      width = stream_settings.width;
      height = stream_settings.height;
      point_width = width > height ? Math.round(height / 100) : Math.round(width / 100);
      document.querySelector("canvas").width = width;
      document.querySelector("canvas").height = height;
    })
    .catch((err) => {
      console.log(err);
    });
}
