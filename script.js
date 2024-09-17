function verifyAge() {
    const isAdult = confirm("Are you 18 years or older?");
    if (isAdult) {
        document.getElementById('age-verification').style.display = 'none';
        document.getElementById('features').style.display = 'block';
    } else {
        document.getElementById('age-error').style.display = 'block';
    }
}
