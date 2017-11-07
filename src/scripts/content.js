
// var xmlHttp = new XMLHttpRequest();
// xmlHttp.open('GET', "/src/html/annotatorTemplate.html", false);
// xmlHttp.send(null);
//
// console.log(xmlHttp.responseText);

let destinationElement = document.getElementById('h-top-questions');
destinationElement.style.position = 'relative';

/**
 *
 * @todo this sould be passed by background.js who has access to extension files
 * @todo positioning css from .annotator-container should be handled by each page individually
 */
let html = `

    <div class="annotator-container">
        <div class="annotator__inputs">
            <textarea class="input__text custom-scrollbar" placeholder="How exciting is to annotate"></textarea>
        </div>
        <div class="annotator__actions">
            <div class="action__save">Save</div>
        </div>
    </div>

    <style>
        * {
            box-sizing: border-box;
        }
        .annotator-container {
            width: 300px;
            height: 150px;
            border-radius: 10px;
            display: flex;
            flex-direction: column;
            background: grey;
            position: absolute;
            bottom:10px;
            z-index: 10000;
        }

        .annotator__inputs {
            flex: 2;
            background: white;
        }

        .annotator__actions {
            display: flex;
            flex-direction: row-reverse;
            background: #eeeeee;
        }

        .input__text {
            border: none;
            outline: none;
            width: 100%;
            height: 100%;
            resize: none;
        }

        .custom-scrollbar::-webkit-scrollbar {
            width: 1em;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
            -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
            background-color: darkgrey;
            outline: 1px solid slategrey;
        }

        .action__save {
            background: #007dc1;
            border-radius: 3px;
            border: 1px solid #124d77;
            display: inline-block;
            cursor: pointer;
            color: #fff;
            font-size: 1rem;
            padding: 2px 8px;
            text-decoration: none;
        }

        .action__save:hover {
            background-color: #0061a7;
        }

        .action__save:active {
            position: relative;
            top: 1px;
        }
    </style>
`;

let newContent = document.createElement('div');
newContent.innerHTML = html;

destinationElement.appendChild(newContent);
