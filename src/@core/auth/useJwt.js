import JwtService from './jwtServices';

function Jwt(jwtOverrideConfig) {
  const jwt = new JwtService(jwtOverrideConfig);

  return {
    jwt,
  };
}

const {jwt} = new Jwt({});

export default jwt;
