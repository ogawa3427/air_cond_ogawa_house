function addUnit(label, preData) {
    const container = document.createElement('div');
    container.className = 'unit'; // unitクラスを追加

    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'bitInput value'; // valueクラスを追加
    input.placeholder = 'Enter a number';

    const labelElement = document.createElement('input');
    labelElement.placeholder = 'Enter a label';
    labelElement.className = 'label'; // labelクラスを追加
    if (label) {
        labelElement.value = label;
    }

    const button = document.createElement('button');
    button.textContent = 'バイナリを２進数で表示';
    button.onclick = function() {
        displayBits(input, container.querySelector('.bitOutput')); // inputとoutputを引数として渡す
    };

    const output = document.createElement('div');
    output.className = 'bitOutput'; // idからclassに変更

    if (preData) {
        input.value = preData;
        displayBits(input, output);
    }

    container.appendChild(input);
    container.appendChild(labelElement);
    container.appendChild(button);
    container.appendChild(output);

    // #bitViewer 要素に container を追加
    const bitViewer = document.getElementById('bitViewer');
    if (bitViewer) {
        bitViewer.appendChild(container);
    } else {
        console.error('#bitViewer element not found');
    }
}
function displayBits(inputElement, outputElement) {
    let hexInput = inputElement.value;
    outputElement.innerHTML = ''; // Clear previous bits
    if (!hexInput) {
        hexInput = '0';
    }

    if (hexInput.startsWith('0x')) {
        hexInput = hexInput.substring(2);
    }

    if (!hexInput.match(/^[0-9a-fA-F]+$/)) {
        alert('Please enter a valid hexadecimal number.');
        return;
    }

    const binaryString = hexToBinary(hexInput);
    const groupedBinaryString = binaryString.match(/.{1,4}/g) || []; // 4ビットごとに分割
    groupedBinaryString.reverse(); // 逆順にする
    hexInput.split('').reverse().forEach((hexChar, index) => {
        const groupDiv = document.createElement('div');
        groupDiv.style.marginRight = '10px'; // グループ間の余白を設定
        groupDiv.style.display = 'inline-block'; // グループを横に並べる
        groupDiv.style.textAlign = 'center'; // グループ内のビットを中央揃えに設定
        groupDiv.style.flexDirection = 'column'; // グループ内のビットを縦に並べる

        const hexSpan = document.createElement('span');
        hexSpan.textContent = hexChar;
        hexSpan.style.color = 'blue';
        hexSpan.style.fontWeight = 'bold';
        groupDiv.appendChild(hexSpan);

        const bitParent = document.createElement('div');

        const binaryGroup = groupedBinaryString[index];
        binaryGroup.split('').forEach(bit => {
            const bitDiv = document.createElement('div');
            bitDiv.className = 'bit ' + (bit === '1' ? 'black' : 'red');
            bitDiv.style.display = 'inline-block'; // ビットを横に並べる
            bitDiv.style.marginRight = '0px'; // グループ内のビット間の余白をゼロに設定

            const bitText = document.createElement('span');
            bitText.textContent = bit;
            if (bit === '1') {
                bitText.style.color = 'white';
            } else {
                bitText.style.color = 'black';
            }
            bitDiv.appendChild(bitText);
            bitParent.appendChild(bitDiv);
        });

        groupDiv.appendChild(bitParent);

        outputElement.appendChild(groupDiv);
    });
}

function hexToBinary(hex) {
    return hex.split('').map(h => {
        return parseInt(h, 16).toString(2).padStart(4, '0');
    }).join('');
}
// URLからクエリパラメータを取得する関数
function getQueryParams() {
    const params = new URLSearchParams(window.location.search);
    params.forEach((value, key) => {
        console.log(`${key}: ${value}`);
    });
    return params;
}
function generateLink() {
    const units = document.querySelectorAll('#bitViewer .unit');
    console.log(units);
    let queryParams = [];
    units.forEach(unit => {
        let key = unit.querySelector('.label').value; // .textContentから.valueに変更
        const value = unit.querySelector('.bitInput').value; // .textContentから.valueに変更し、クラス名も修正
        if (!key) {
            key = value;
        }
        queryParams.push(`${encodeURIComponent(key)}=${encodeURIComponent(value)}`);
    });
    const queryString = queryParams.join('&');
    const link = window.location.origin + window.location.pathname + '?' + queryString;
    console.log('生成されたリンク:', link);

    const linkContainer = document.getElementById('link_box');
    linkContainer.innerHTML = ''; // 前回の出力を消す
    const linkElement = document.createElement('input');
    linkElement.value = link;
    linkElement.readOnly = true;
    linkElement.style.width = '100%';
    linkContainer.appendChild(linkElement);
}
