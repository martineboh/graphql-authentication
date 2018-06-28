import { GraphQLServer } from 'graphql-yoga';
import * as path from 'path';
import * as Email from 'email-templates';
import { Prisma } from '../src/generated/prisma';
import {
  authQueries,
  authMutations,
  graphqlAuthenticationConfig
} from 'graphql-authentication';
import { GraphqlAuthenticationPrismaAdapter } from '../src';

const resolvers = {
  Query: {
    ...authQueries,
    timeline() {
      return [{ name: 'Testje' }];
    }
  },
  Mutation: {
    ...authMutations
  }
};

const mailer = new Email({
  message: {
    from: 'info@volst.nl'
  },
  views: {
    root: path.join(__dirname, 'emails')
  }
});

const server = new GraphQLServer({
  typeDefs: './example/schema.graphql',
  resolvers,
  context: req => ({
    ...req,
    db: new Prisma({
      endpoint: 'http://localhost:4466',
      debug: true
    }),
    graphqlAuthentication: graphqlAuthenticationConfig({
      adapter: new GraphqlAuthenticationPrismaAdapter(),
      secret: 'wherearemyshoes',
      mailer,
      mailAppUrl: 'http://example.com',
      requiredConfirmedEmailForLogin: true
    })
  })
});
server.start(() => console.log('Server is running on http://localhost:4000'));
