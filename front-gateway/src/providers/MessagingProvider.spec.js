'use strict';
import faker from 'faker';
import utils from '~/providers/utils';
import MessagingProvider from './MessagingProvider.js';

describe('Messaging Provider', () => {
  let messagingProvider;
  let authStoreMock;
  let messagingStoreMock;

  beforeEach(() => {
    authStoreMock = {};
    messagingStoreMock = {};

    process.env.TALKJS_PUBLISHABLE_KEY = 'mockTalkJSPublishableKey';

    messagingProvider = new MessagingProvider(authStoreMock, messagingStoreMock);
  });

  afterEach(() => jest.resetAllMocks());

  describe('constructor', () => {
    it('should set members and init talkjs', () => {
      messagingProvider.talkjs = jest.fn().mockReturnValue(true);

      messagingProvider.talkjsLoaded = false;
      messagingProvider.constructor(authStoreMock, messagingStoreMock);

      expect(messagingProvider.authStore).toEqual(authStoreMock);
      expect(messagingProvider.messagingStore).toEqual(messagingStoreMock);
      expect(messagingProvider.talkjs).toHaveBeenCalledWith(global.window, document, []);
      expect(messagingProvider.talkjsLoaded).toBeTruthy();
    });
  });

  describe('initTalkUser', () => {
    it('should return false if a talkUser is not already defined and user is not logged in', () => {
      expect(messagingProvider.initTalkUser()).toEqual(false);
    });

    it('should return true if a talkUser is already defined', () => {
      messagingProvider.talkUser = jest.fn();

      expect(messagingProvider.initTalkUser()).toEqual(true);
    });

    it('should setup a new talkUser and return true', () => {
      global.window.Talk = {User: jest.fn()};
      authStoreMock.isLoggedIn = true;
      authStoreMock.profile = {
        dorbel_user_id: faker.random.uuid(),
        first_name: faker.name.firstName(),
        email: faker.internet.email(),
        picture: faker.internet.url()
      };

      expect(messagingProvider.talkUser).toBeUndefined();
      const result = messagingProvider.initTalkUser();

      expect(messagingProvider.talkUser).toBeDefined();
      expect(global.window.Talk.User).toHaveBeenCalledWith({
        id: authStoreMock.profile.dorbel_user_id,
        name: authStoreMock.profile.first_name,
        email: authStoreMock.profile.email,
        photoUrl: authStoreMock.profile.picture,
        configuration: 'general'
      });
      expect(result).toEqual(true);
    });
  });

  describe('initTalkSession', () => {
    beforeEach(() => {
      messagingProvider.initTalkUser = jest.fn();
    });

    it('should return false if a talk user was not already initialized', () => {
      messagingProvider.initTalkUser.mockReturnValue(false);
      expect(messagingProvider.initTalkSession()).toEqual(false);
    });

    it('should return true and setup a new talkSession', () => {
      messagingProvider.initTalkUser.mockReturnValue(true);
      const talkUserMock = jest.fn();
      const talkSessionMock = { on: jest.fn(), unreads: {on: jest.fn()} };
      messagingProvider.talkUser = talkUserMock;
      global.window.Talk = { Session: jest.fn(() => talkSessionMock) };

      global.window.dorbelConfig = {
        TALKJS_APP_ID: faker.random.uuid(),
        TALKJS_PUBLISHABLE_KEY: faker.random.uuid()
      };

      expect(messagingProvider.talkSession).toBeUndefined();
      const result = messagingProvider.initTalkSession();

      expect(messagingProvider.talkSession).toBeDefined();
      expect(global.window.Talk.Session).toHaveBeenCalledWith({
        appId: global.window.dorbelConfig.TALKJS_APP_ID,
        publishableKey: global.window.dorbelConfig.TALKJS_PUBLISHABLE_KEY,
        me: talkUserMock
      });
      expect(result).toEqual(true);
      expect(talkSessionMock.on.mock.calls[0][0]).toBe('message');
      expect(talkSessionMock.unreads.on.mock.calls[0][0]).toBe('change');
    });
  });

  xdescribe('getOrStartConversation', () => {
    beforeEach(() => {
      messagingProvider.initTalkSession = jest.fn();
    });

    it('should return undefined if a talk session fails to initialize', () => {
      messagingProvider.initTalkSession.mockReturnValue(false);

      const prom = messagingProvider.getOrStartConversation().then(result => expect(result).toBeUndefined());
      prom.resolve();
    });

    it('should create and return a popup', () => {
      messagingProvider.initTalkSession.mockReturnValue(true);
      utils.hideIntercom = jest.fn();

      messagingProvider.getOrStartConversation().then(result => expect(result).toBeUndefined());

      utils.flushPromises().then(result => {
        expect(result).toBeUndefined();
        expect(messagingProvider.talkSession.getOrStartConversation).toHaveBeenCalledWith();
      });
    });
  });
});
