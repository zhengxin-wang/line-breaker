# Line breaker

![Logo](/images/line-breaker.png)

- This line-breaker is a VS code extension that would switch between single and multi line format for texts with brackets.
- The operation is made in the most simple way:
- Step 1: choose target text by either
    - Simply put the cursor at the open bracket or close bracket line. (***Recommended***)
    - Select the text by mouse.
- Step 2: Trigger the Switch by either of below 
  - Hot key: Ctrl + Alt + L (***Recommended***)
  - Type Command + P to open VS Code Command Palette and input >switch between... then click to execute.

## Supported switches:
### Simple Object
From
```
 return { a: 'a', b: true }; 
```
to below and vice versa.
```
  return {
    a: 'a',
    b: true
  }; 
```

### Function Params
From
```
const functionA = ({ param1, param2, param3, })
```
to below and vice versa.
```
const functionA = ({ 
  param1,
  param2,
  param3,
}) => {
  // some code
};
```

### Nested Object
From
```
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
```
to below and vice versa.
```
export const nestedObject = { moderation: { approve: 'models.approve.post', reject: 'models.reject.post', moderation: { approve: 'models.approve.post', reject: 'models.reject.post' } } }
```

Github Link: [line-breaker](https://github.com/zhengxin-wang/line-breaker)