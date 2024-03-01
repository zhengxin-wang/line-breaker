export const object = {
  moderation: {
    approve: 'models.prompt_lib.approve.post',
    reject: 'models.prompt_lib.reject.post',
    moderation: {
      approve: 'models.prompt_lib.approve.post',
      reject: 'models.prompt_lib.reject.post'
    }
  }
}

/* Expected output:
{ moderation: { approve: 'models.prompt_lib.approve.post', reject: 'models.prompt_lib.reject.post', moderation: { approve: 'models.prompt_lib.approve.post', reject: 'models.prompt_lib.reject.post' } } }
*/