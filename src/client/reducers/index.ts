import register from './register.reducer';
import authentication from './authentication.reducer';
import veriFace from './veri-face.reducer';

const rootReducer = {
authentication,
  register,
  veriFace,
};

export default rootReducer;
