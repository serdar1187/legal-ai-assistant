import { type ClientSchema, a, defineData } from '@aws-amplify/backend';

const schema = a.schema({
  chat: a.conversation({
    aiModel: a.ai.model('Claude 3.7 Sonnet'),
    systemPrompt: `Sen Türk hukuku konusunda uzman bir AI asistanısın. 
    Türk hukuku, mevzuat ve yasal prosedürler hakkında doğru bilgi veriyorsun.
    Sadece hukuki konularda yardım ediyorsun.
    Türkiye Cumhuriyeti kanunları, yönetmelikler ve içtihatlar konusunda 
    detaylı bilgi sağlıyorsun.`
  })
});

export type Schema = ClientSchema<typeof schema>;
export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'userPool',
  },
});

