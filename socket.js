var os = require('os');
const SocketIO = require('socket.io');


//소켓통신 모듈
module.exports = (server) => {

  //express서버와 socket.io연결
  const io = SocketIO(server, { path: '/socket.io' });

  //socket 연결이 완료된 상태에서의 기능처리
  io.on('connection', (socket) => {

    //소켓Req객체
    const req = socket.request;

    //접속 클라이언트 IP주소
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

    console.log('새로운 클라이언트 접속!', ip, socket.id, req.ip);


    //서버에서의 로깅정보를 현재접속자에게 보내는 함수
    function log() {
      var array = ['Message from server:'];
      array.push.apply(array, arguments);
      socket.emit('log', array);
    }

    //소켓 연결해제
    socket.on('disconnect', () => {
      clearInterval(socket.interval);
    });

    //소켓 에러발생시 로깅
    socket.on('error', (error) => {
      console.error(error);
    });

    //사용자 채팅 메시지 브로드 캐스팅처리
    socket.on('message', function (nick,message) {
      
      //log(nick+' Client said:', message);

      //현재 접속자에게만 메시징 보내기
      socket.emit('message',nick, message);

      //자신을 제외한 모든 사용자에게 메시징
      socket.broadcast.emit('message',nick, message);
    });

  });
};