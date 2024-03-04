const object = {
  key1: "value1",
  key2: "value2",
  key3: "value3"
}

/* Expected output:
{ key1: "value1", key2: "value2", key3: "value3" }
*/

const functionA = ({ 
  param1,
  param2,
  param3,
}) => {
  // some code
};

/* Expected output:
{ param1, param2, param3, }
*/

export const nestedObject = {
  moderation: {
    approve: 'models.approve.post',
    reject: 'models.reject.post',
    moderation: {
      approve: 'models.approve.post',
      reject: 'models.reject.post'
    }
  }
}

/* Expected output:
{ moderation: { approve: 'models.approve.post', reject: 'models.reject.post', moderation: { approve: 'models.approve.post', reject: 'models.reject.post' } } }
*/