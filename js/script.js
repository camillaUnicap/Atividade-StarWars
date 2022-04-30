
const mostrarConteudo = (elementosConteudo, indice) => {

    let tamanhoArray = elementosConteudo.length;

    for (let i = 0; i < tamanhoArray; i++) {

        if (i == indice)
            elementosConteudo[indice].style.display = "block";
        else
            elementosConteudo[i].style.display = "none";

    }

}

const card = (conteudo, elemento, linkImagem, opcao) => {

    if (opcao == "padrao") {

        let conteudoHTML;

        if (conteudo == "films") {

            conteudoHTML = `<div class="card_info">
                        <div class="card_img">
                            <img src='${linkImagem}' class='card_img_item'>
                        </div>
                        <div class="card_titulo">
                            ${elemento.title}
                        </div>
                    </div>
                    `;

        }
        else if (conteudo == "people") {

            conteudoHTML = `<div class="card_info">
                        <div class="card_img">
                            <img src='${linkImagem}' class='card_img_item'>
                        </div>
                        <div class="card_titulo">
                            ${elemento.name}
                        </div>

                    </div>
                    `;

        }

        const $conteudo = document.getElementById("cont_conteudo_" + conteudo);
        $conteudo.innerHTML += conteudoHTML;
        setCardEvent($conteudo.children);

    }


}


const buscarInfoAPI = (pagina, conteudo) => {

    let url = `https://swapi.dev/api/${conteudo}/?page=${pagina}`;

    fetch(url)
        .then(dados => dados.json())
        .then(json => transformJson(json));

    const transformJson = json => {

        let arrayJson = json.results;

        // Varre os resultados do JSON. 
        for (let i = 0; i < arrayJson.length; i++) {

            let imagem = arrayJson[i].url.split("").filter(element => Number.isInteger(Number.parseInt(element))).join("");

            let conteudoImagem = conteudo;
            if (conteudoImagem == "people")
                conteudoImagem = "characters";

            let urlImagem = `https://starwars-visualguide.com/assets/img/${conteudoImagem}/${imagem}.jpg`;

            fetch(urlImagem)
                .then(resp => verificarURL(resp))

            const verificarURL = resp => {

                if (resp.status != 200) {
                    urlImagem = "https://starwars-visualguide.com/assets/img/placeholder.jpg";
                    card(conteudo, arrayJson[i], urlImagem, "padrao");
                } else
                    card(conteudo, arrayJson[i], urlImagem, "padrao");

            }


        }

        if (json.next != null) {
            buscarInfoAPI(pagina + 1, conteudo);
        }

    }
}


const addClickMenu = itensMenu => {

    let tamanhoarray = itensMenu.length;
    const $conteudos = document.getElementById("cont_conteudo").children;

    for (let i = 0; i < tamanhoarray; i++) {
        itensMenu[i].addEventListener("click", () => mostrarConteudo($conteudos, i));

    }

}

const $itensMenu = document.querySelectorAll('.menu_itens');
addClickMenu($itensMenu);


buscarInfoAPI(1, "films");
buscarInfoAPI(1, "people");