const questions=[
 {type:'choice',q:'Какое наше свидание ты бы повторила прямо сейчас?',o:['Тихая прогулка вдвоём','Уютный вечер дома','Спонтанная поездка','Долгий разговор за кофе']},
 {type:'choice',q:'Какое слово лучше всего описывает нас?',o:['Нежность','Приключение','Дом','Искра']},
 {type:'choice',q:'Как мне лучше поддержать тебя в трудный день?',o:['Обнять и молчать рядом','Выслушать всё до конца','Рассмешить','Помочь делом']},
 {type:'choice',q:'Какой маленький мой жест тебе особенно дорог?',o:['Сообщения без повода','Внимание к деталям','Объятия','Забота в мелочах']},
 {type:'choice',q:'Какой вечер для нас идеальный?',o:['Фильм и плед','Городские огни','Музыка и разговоры','Звёзды и тишина']},
 {type:'choice',q:'Что ты хочешь попробовать вместе?',o:['Новое место','Общее хобби','Маленькое путешествие','Смелую мечту']},
 {type:'choice',q:'Что из этого тебе важнее всего в любви?',o:['Честность','Надёжность','Лёгкость','Внимательность']},
 {type:'choice',q:'Какую нашу традицию стоит придумать?',o:['Письма друг другу','Один вечер без телефонов','Спонтанные свидания','Фото каждого месяца']},
 {type:'choice',q:'Где тебе спокойнее всего со мной?',o:['Когда я рядом','В наших разговорах','В объятиях','В совместных планах']},
 {type:'choice',q:'Какой комплимент от меня хочется слышать чаще?',o:['Ты невероятная','Я тобой горжусь','Ты делаешь меня счастливым','Мне с тобой легко']},
 {type:'text',q:'Что во мне ты заметила самым первым?',p:'Напиши так, как чувствуешь…'},
 {type:'text',q:'Какой наш момент ты хранишь особенно бережно?',p:'Расскажи мне о нём…'},
 {type:'text',q:'О чём ты мечтаешь вместе со мной?',p:'Даже если это пока просто мечта…'},
 {type:'text',q:'Что я делаю, от чего ты улыбаешься?',p:'Мне очень хочется это знать…'},
 {type:'text',q:'За что тебе хотелось бы сказать мне «спасибо»?',p:'Тут можно быть совершенно честной…'},
 {type:'text',q:'Какой ты видишь нас через год?',p:'Нарисуй словами нашу маленькую картину…'},
 {type:'text',q:'Что мне стоит узнать о тебе лучше?',p:'Я буду слушать внимательно…'},
 {type:'text',q:'Как я могу любить тебя ещё бережнее?',p:'Твои желания важны для меня…'},
 {type:'text',q:'Что бы ты хотела пережить со мной впервые?',p:'Твоя очередь загадывать…'},
 {type:'text',q:'Оставь мне одно тёплое сообщение.',p:'Я сохраню его в сердце…'}
];
let current=0;let answers=JSON.parse(localStorage.getItem('between-us-answers')||'[]');const $=s=>document.querySelector(s);
function save(){localStorage.setItem('between-us-answers',JSON.stringify(answers));}
function render(){const item=questions[current];$('#count').textContent=`${current+1} из ${questions.length}`;$('#bar').style.width=`${((current+1)/questions.length)*100}%`;$('#kind').textContent=item.type==='choice'?'ВЫБЕРИ ТО, ЧТО БЛИЖЕ':'НЕСКОЛЬКО ТЁПЛЫХ СЛОВ';$('#question').textContent=item.q;const response=$('#response');if(item.type==='choice'){response.innerHTML=`<div class="options">${item.o.map((value,i)=>`<button class="option ${answers[current]===value?'selected':''}" type="button" data-value="${value}"><span class="letter">${['А','Б','В','Г'][i]}</span>${value}</button>`).join('')}</div>`;response.querySelectorAll('.option').forEach(button=>button.onclick=()=>{answers[current]=button.dataset.value;save();response.querySelectorAll('.option').forEach(x=>x.classList.toggle('selected',x===button));});}else{response.innerHTML=`<textarea class="open-answer" maxlength="1000" placeholder="${item.p}">${answers[current]||''}</textarea>`;response.querySelector('textarea').oninput=e=>{answers[current]=e.target.value;save();};}$('#next').innerHTML=current===questions.length-1?'Сохранить ответы <span>♥</span>':'Дальше <span>→</span>';$('#back').style.visibility=current?'visible':'hidden';}
function showResults(){save();$('#form').classList.add('hidden');$('#result').classList.remove('hidden');const name=$('#name').value.trim();$('#thank-you').textContent=name?`Спасибо, ${name}.`:'Спасибо, любимая.';$('#answers-list').innerHTML=questions.map((q,i)=>`<article class="answer-card"><p class="answer-question">${i+1}. ${q.q}</p><p class="answer-value">${answers[i]?.trim()||'—'}</p></article>`).join('');window.scrollTo({top:0,behavior:'smooth'});}
$('#start').onclick=()=>{localStorage.setItem('between-us-name',$('#name').value);$('#welcome').classList.add('hidden');$('#form').classList.remove('hidden');render();};$('#name').value=localStorage.getItem('between-us-name')||'';$('#back').onclick=()=>{if(current){current--;render();}};$('#next').onclick=()=>{if(current<questions.length-1){current++;render();window.scrollTo({top:0,behavior:'smooth'});}else showResults();};$('#edit').onclick=()=>{$('#result').classList.add('hidden');$('#form').classList.remove('hidden');current=0;render();};$('#share').onclick=async()=>{const name=$('#name').value.trim()||'Твои ответы';const text=`${name}\n\n${questions.map((q,i)=>`${i+1}. ${q.q}\n${answers[i]?.trim()||'—'}`).join('\n\n')}`;try{if(navigator.share)await navigator.share({title:'Между нами',text});else{await navigator.clipboard.writeText(text);$('#share-note').textContent='Ответы скопированы — вставь их в любой мессенджер.';}}catch(e){if(e.name!=='AbortError')$('#share-note').textContent='Не получилось отправить. Попробуй ещё раз.';}};
