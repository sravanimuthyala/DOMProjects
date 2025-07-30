document.addEventListener("DOMContentLoaded", () => {
  const inputfield = document.getElementById('palindromeinput');
  const check = document.getElementById('check');
  const result = document.querySelector('.resultDiv');
  const h2 = document.getElementById('output');
  const emoji = document.getElementById('emoji');
  const comparison = document.querySelector('.comparison');
  const stepsList = document.getElementById('steps');
  const denyList = ["fuckoff", "fuck", "bitch", "bish", "shit", "sex", "porn"];

  check.addEventListener('click', () => checkPalindrome());
  inputfield.addEventListener("keypress", (e) => {
    if (e.key === "Enter") checkPalindrome();
  });

  function checkPalindrome() {
    result.classList.add('hidden');
    comparison.classList.add('hidden');
    stepsList.innerHTML = '';

    const rawinput = inputfield.value.trim();
    if (!rawinput) {
      showError('Please enter a word or phrase');
      return;
    }

    for (const deny of denyList) {
      if (rawinput.toLowerCase().includes(deny)) {
        showError('Inappropriate input');
        return;
      }
    }

    const cleanInput = rawinput.toLowerCase().replace(/[^a-z0-9]/g, "");
    if (!cleanInput) {
      showError("Please enter at least one alphanumeric character");
      return;
    }

    const steps = [];
    collectPalindromeSteps(cleanInput, 0, cleanInput.length - 1, steps);
    const isPalindrome = steps.every(step => step.match);
    
    displayResult(isPalindrome, rawinput);
    displaySteps(steps);
  }

  function collectPalindromeSteps(str, start, end, steps) {
    if (start >= end) return;

    const startChar = str[start];
    const endChar = str[end];
    const match = startChar === endChar;

    steps.push({
      startIndex: start,
      endIndex: end,
      startChar,
      endChar,
      match
    });

    collectPalindromeSteps(str, start + 1, end - 1, steps);
  }

  function displayResult(isPalindrome, input) {
    result.classList.remove('hidden', 'success', 'failure');

    if (isPalindrome) {
      result.classList.add('success');
      h2.innerText = `"${input}" is a palindrome`;
      emoji.innerText = '🎉';
    } else {
      result.classList.add('failure');
      h2.innerText = `"${input}" is not a palindrome`;
      emoji.innerText = '😕';
    }
  }

  function displaySteps(steps) {
    if (!steps.length) return;
    comparison.classList.remove('hidden');
    stepsList.innerHTML = '';

    steps.forEach((step, index) => {
      const li = document.createElement('li');

      const spanNo = document.createElement('span');
      spanNo.textContent = `Step ${index + 1}: `;

      const spanChar = document.createElement('span');
      spanChar.textContent = `Comparing '${step.startChar}' (position ${step.startIndex + 1}) with '${step.endChar}' (position ${step.endIndex + 1}): `;

      const resultSpan = document.createElement('span');
      resultSpan.textContent = step.match ? "Match! ✓" : "Mismatch! ✗";
      resultSpan.id = step.match ? "stepmatch" : "stepmismatch";

      li.append(spanNo, spanChar, resultSpan);
      stepsList.appendChild(li);
    });
  }

  function showError(message){
    result.classList.remove('hidden');
   result.classList.remove('success');
    result.classList.add('failure');
    emoji.textContent='⚠️'
    h2.innerText=message;
  }
});
