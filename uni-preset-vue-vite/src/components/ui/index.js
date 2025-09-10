import FormInput from './FormInput.vue';
import ActionButton from './ActionButton.vue';
import ModalDialog from './ModalDialog.vue';
import MenuItem from './MenuItem.vue';
import StatCard from './StatCard.vue';

// 统一导出所有UI组件
export {
  FormInput,
  ActionButton,
  ModalDialog,
  MenuItem,
  StatCard
};

// 全局注册所有组件的函数
export const registerUIComponents = (app) => {
  app.component('FormInput', FormInput);
  app.component('ActionButton', ActionButton);
  app.component('ModalDialog', ModalDialog);
  app.component('MenuItem', MenuItem);
  app.component('StatCard', StatCard);
};

export default {
  install: (app) => {
    registerUIComponents(app);
  }
}; 