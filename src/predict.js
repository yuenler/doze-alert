
const predict = async (src) => {
  const tf = require('@tensorflow/tfjs');
  const model = await tf.loadGraphModel('https://raw.githubusercontent.com/yuenler/doze-alert/main/machineLearning/model.json')
  const imageTF = tf.browser.fromPixels(src).toFloat().div(tf.scalar(255.0)).reshape([-1, 64, 64, 3]);
  const prediction = await model.predict(imageTF).data();
  return prediction[0];
}
export default predict;