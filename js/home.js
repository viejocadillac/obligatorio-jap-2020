//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.
document.addEventListener("DOMContentLoaded", function (e) {
    const productsContainer = document.getElementById('categories-container')
    getJSONData(CATEGORIES_URL).then(({data}) => {
        data.forEach((producto) => {
            productsContainer.innerHTML += `
            <section class="producto">
                <header>
                    <img src="${producto.imgSrc}" alt="">
                </header>
                <div class="product-body">
                    <h2 class="product-price">${producto.name}</h2>
                    <p class="product-description">${producto.description}</p>
                </div>
                <hr>
                <p class="vendidos"><span id="cantidad-vendidos">${producto.productCount}</span> productos.</p>
            </section>
            
            `;
        })
    })

});