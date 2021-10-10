
$(document).ready(function () {
    const requestUrl = "https://optimaxdev.github.io/volga-it/response.json"
    const dataWrapperMainGlasses = document.getElementById('data-wrapper-main_glasses')
    const dataWrapperGlasses = document.getElementById('data-wrapper-glasses')
    

    /*Шаблон для кнопки upload*/ 
    const startbutton = () =>{
        return `
                        <button class="upload startbutton" >
							<div class="imgsetting">
								<img src="img/Camera.svg" alt="Камера">
								<span>Upload</span>
							</div>
						</button>
                        `
                    }

    /*Шаблон для очков в header*/
    const createTemplateMainGlasses = data => {
        return `
            <section class="offer-description">
            <h2 class="title-glasses">${data.name}</h2>
            <img src="${data.image}" alt="${data.name}">
            <button class="black-button"><span>Choose Lenses</span></button>
            <h2 class="product-description">Product Description</h2>
            <main>${data.description}</main>
            </section>
        `
    }

    /*Шаблон для очков в footer*/ 
    const createTemplateChoiceGlasses = data => {
        return `
                <figure>
                    <img src="${data.image}" alt="${data.name}">
                    <figcaption>${data.name}</figcaption>
                </figure> 
            `
    }

    //Данные для очков
    const urlGlasses = data => {
        return data.mirror_frame;
    }

    const FrameWidth = data => {
            return data.width;
        }
    let framewidth, url_image;


    /*Обращение к серверу*/
    fetch(requestUrl)
        .then(res => res.json())
        .then(data => {
            data.items.forEach(items => {
                dataWrapperMainGlasses.innerHTML = createTemplateMainGlasses(items);
                framewidth = FrameWidth(items);
                url_image = urlGlasses(items);
            })
        })

    fetch(requestUrl)
        .then(res => res.json())
        .then(data => {
            let i = 0;
            data.items.forEach((items, i) => {
                if (i < 3) {
                    dataWrapperGlasses.innerHTML += createTemplateChoiceGlasses(items);
                    
                } else {
                    i++;
                }
            })
        })


    /*Шаблоны для 2 страницы т.е. правила для фото, коректировка фото, примерки очков*/ 
    const createTemplateAdjustGlasses= () =>{
        return `<section class="adjust-the-image">
                    <button><img src="img/arrow_left.svg"><span class="adjust-the-image_button">Back</span></button>
                    <h2>Adjust the Image</h2>
                    <ol>
                        <li style="padding-bottom: 28px;">Drag the RED targets to the center of your eyes.</li>
                        <li style="padding-bottom: 43px;">Drag to reposition photo</li>
                        <li style="padding-bottom: 37px;">Set your PD, if you know it. 
                            <input type="text" placeholder="  62" id="pd" >
                        </li>
                        <li style="padding-bottom: 27px;">Adjust the photo with the controls.</li>
                    </ol>
                </section>
        `
    }
    const createTemplateTryOnGlasses = () =>{
        return `
            <button class="black-button tryon">Try on Glasses</button>
            <button class="reset">Reset Adjastments</button>
        `
    }
    
    
        
    
    
    


    
    /*Начало работы, запуск веб-камеры, режим  "Сделать фото"*/
    $('.startbutton').click(function func() {
        //Замена заглавного фото на видеопоток с веб-камеры, СSS корректировки при замене
        $('.example').replaceWith("<video autoplay></video>");
        $('.offer-fit > video').attr('id', 'video');
        $('#video').after('<canvas></canvas>');
        $('.offer-fit > canvas').attr('id', 'canvas');
        $('#canvas').css('display', 'none')
        $('#video, #canvas').css({ width: '444px', height: '414px', marginBottom: '24px', position: 'relative', top: '0', left: '0' })


        //Замена кнопки upload на take a photo
        $('.startbutton').replaceWith('<button class="upload"><div class="imgsetting"><img src="img/Camera.svg" alt="Камера"><span>Take a photo</span></div></button>');
        $('.offer-fit > button').attr('id', 'takephoto');
        $('.upload').css({ width: '140px' });
        $('.upload span').css({ width: '90px' });



        let video = $('#video')[0];

        function onStreaming(stream) {
            video.srcObject = stream;
        }

        navigator.mediaDevices.getUserMedia({ video: true }).then(onStreaming);


        /* Пользователь делает фото*/
        $('#takephoto').click(function func() {
            canvas.getContext('2d').drawImage(video, 0,0, canvas.width, canvas.height);
            let image_data_url = canvas.toDataURL('image/jpeg');
            
            $('#video').replaceWith('<img class="example photo"></img>');
            $('.photo').attr('src', image_data_url);
            video.srcObject = onoffline;
            

            $('#takephoto').replaceWith(startbutton());
            $('.startbutton span').html('Retake');

            //Замена содержимого начальной страниы на инструцию для пользователя
            $('#data-wrapper-main_glasses').replaceWith(createTemplateAdjustGlasses);
            $('#frameses').replaceWith(createTemplateTryOnGlasses);


            //Отметки на лице
            $('.photo').after('<div id="cross1"><img src="img/cross.svg"></div><div id="cross2"><img src="img/cross.svg"></div>');
            $('#cross1').css({display:'inline-block',position:'absolute',top:'275px',left:'400px'});
            $('#cross2').css({display:'inline-block',position:'absolute',top:'275px',left:'500px'});

            
            
            
            $('#cross1').draggable({
                cursor: 'move',
                containment: 'document',
                stop: function ( event, ui ) {
                    let offsetXPos = parseInt( ui.offset.left );
                    let offsetYPos = parseInt( ui.offset.top );
                    $('#cross1').css('left', offsetXPos)
                    $('#cross1').css('top', offsetYPos);
                
                }
                
                
            })
            
            $('#cross2').draggable({
                cursor: 'move',
                containment: 'document',
                stop: function ( event, ui ) {
                    let offsetXPos = parseInt( ui.offset.left );
                    let offsetYPos = parseInt( ui.offset.top );
                    $('#cross2').left = offsetXPos;
                    $('#cross2').top = offsetYPos;
                
                }

            })
           
            
            /*Примерка очков*/
            $('.tryon').click(function func() {
                //Для подсчета разницы между глазами
                let Cordinatecross1X = cross1.getBoundingClientRect().right;
                let Cordinatecross2X  = cross2.getBoundingClientRect().left;
                let distanceBetweenPupilMarks = Math.abs(Cordinatecross1X-Cordinatecross2X);
                //Координаты очков
                let Cordinatecross1Y  = cross1.getBoundingClientRect().top + 8;
                let  Cordinatecross1XX = cross1.getBoundingClientRect().left - 17;
                
                //Убрать кресты с глаз
                $('#cross1').css('display','none');
                $('#cross2').css('display','none');
                
                //Вызов изображения очков с сервера
                $('.photo').after('<img class="glasses id="glasses">');
                $('.glasses').attr('src',url_image);
                
                
                //Подсчет размера очков
                frameImageWidth = 0.36;
                let pd = document.getElementById('#pd') ? document.getElementById('#pd'):62;
                let frameScaleRatio = (framewidth / frameImageWidth) / (pd /distanceBetweenPupilMarks);


                //css данные для очков
                $('.glasses').css({position:'absolute', top: Cordinatecross1Y, left:  Cordinatecross1XX, width: frameScaleRatio, 'z-index': 1});

            })

       
    })



    })
})
