import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import client from '../../client';

export default {
  Mutation: {
    login: async (_, { username, password }) => {
      console.log('login resolver');
      // find user with args.username
      const user = await client.user.findFirst({ where: { username } });

      if (!user) {
        return {
          ok: false,
          error: 'User not found',
        };
      }
      // Check password with args.password
      const passwordOk = await bcrypt.compare(password, user.password);
      if (!passwordOk) {
        return {
          ok: false,
          error: 'Incorrect password',
        };
      }
      // issue a tokenand send it to the user
      const token = await jwt.sign({ id: user.id }, process.env.SECRET_KEY);
      return {
        ok: true,
        token,
      };
    },
  },
};
