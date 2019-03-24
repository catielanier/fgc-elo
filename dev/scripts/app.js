import React from 'react';
import ReactDOM from 'react-dom';
import firebase from 'firebase';
import { Table, Button, Modal } from 'react-bootstrap/lib';
import PopulateRankings from './PopulateRankings';

// Initialize Firebase
const config = {
  apiKey: "AIzaSyD_L93QGk5L-B8tkewVe8kUCrsK_DjIfFQ",
  authDomain: "sailormoon-elo.firebaseapp.com",
  databaseURL: "https://sailormoon-elo.firebaseio.com",
  projectId: "sailormoon-elo",
  storageBucket: "",
  messagingSenderId: "841627538839"
};
firebase.initializeApp(config);

class App extends React.Component {
  constructor() {
    super();

    this.state = {
      loggedIn: false,
      playerOne: '',
      playerOneELO: '',
      playerTwo: '',
      playerTwoELO: '',
      rankings: [],
      playerCountryShort: '',
      playerCountryLong: '',
      adminEmail: '',
      adminPwd: '',
      showAddELO: false,
      showAddUser: false,
      showLogin: false,
      teamName: '',
      playerName: '',
      playerMainShort: '',
      playerMainLong: '',
      loginErr: false,
      userLocale: navigator.language || navigator.userLanguage,
      locale: {
        en: {
          pageTitle: `Sailor Moon S Global Rankings`,
          subHeading: `Who's the best at fighting evil by moonlight?`,
          rankTitle: `Rank`,
          playerTitle: 'Player',
          characterTitle: `Main`,
          scoreTitle: `Score`
        },
        ko: {
          pageTitle: `세일러문 국제 랭킹`,
          rankTitle: `랭크`,
          playerTitle: `선수`,
          characterTitle: `캐릭터`,
          scoreTitle: `포인트`,
          subHeading: ``
        },
        ja: {
          pageTitle: `セーラームーン国際のランキング`,
          rankTitle: `ランク`,
          playerTitle: `プレヤー`,
          characterTitle: `キャラクター`,
          scoreTitle: `スコア`,
          subHeading: ``
        },
        cn: {
          pageTitle: `美少女戰士国际排行`,
          rankTitle: `等级`,
          playerTitle: `播放机`,
          characterTitle: `人物`,
          scoreTitle: `点`,
          subHeading: ``,
        },
        es: {
          pageTitle: `Clasificación mundial de Sailor Moon S`,
          rankTitle: `Rango`,
          playerTitle: `Jugador`,
          characterTitle: `Protagonista`,
          scoreTitle: `Puntuación`,
          subHeading: ``,
        },
        eo: {
          pageTitle: `Sailor Moon S Tutmondaj Rangoj`,
          rankTitle: `Rango`,
          playerTitle: `Ludanto`,
          characterTitle: `Ĉefkaraktero`,
          scoreTitle: `Poentaro`,
          subHeading: `Kiu plej bonas batali malbonon per luno?`
        },
        hk: {
          pageTitle: `美少女戰士國際排行`,
          scoreTitle: `計`,
          rankTitle: `等級`,
          characterTitle: '人物',
          playerTitle: '播放機',
          subHeading: ''
        },
        ru: {
          pageTitle: `Сейлор Мун Глобальный Pейтинг`,
          scoreTitle: `Точки`,
          rankTitle: `Ранг`,
          characterTitle: `Герой`,
          playerTitle: `Игрок`,
          subHeading: ``
        }
      }
    };

    console.log(`Your language is ${this.state.userLocale}`);

    this.handleShowELO = this.handleShowELO.bind(this);
    this.handleCloseELO = this.handleCloseELO.bind(this);
    this.handlePlayerOne = this.handlePlayerOne.bind(this);
    this.handlePlayerTwo = this.handlePlayerTwo.bind(this);
    this.handleShowUser = this.handleShowUser.bind(this);
    this.handleCloseUser = this.handleCloseUser.bind(this);
    this.handleWinner = this.handleWinner.bind(this);
    this.calculateELO = this.calculateELO.bind(this);
    this.handleNewPlayer = this.handleNewPlayer.bind(this);
    this.handleTeam = this.handleTeam.bind(this);
    this.handleCountry = this.handleCountry.bind(this);
    this.handleMain = this.handleMain.bind(this);
    this.addPlayer = this.addPlayer.bind(this);
    this.handleShowLogin = this.handleShowLogin.bind(this);
    this.handleCloseLogin = this.handleCloseLogin.bind(this);
    this.handleEmail = this.handleEmail.bind(this);
    this.handlePwd = this.handlePwd.bind(this);
    this.doLogin = this.doLogin.bind(this);
  }

  componentDidMount() {
    this.dbRef = firebase.database().ref();
    this.dbRef.on('value', snapshot => {
      const rankings = snapshot.val();
      const rankingsArray = [];
      for (let item in rankings) {
        rankingsArray.push(rankings[item])
      }
      rankingsArray.sort((a, b) => {
        return b.ELO - a.ELO
      });
      this.setState({
        rankings: rankingsArray
      });
    });
  }

  doLogin(e) {
    e.preventDefault();
    const email = this.state.adminEmail;
    const password = this.state.adminPwd;
    firebase.auth().signInWithEmailAndPassword(email, password).then((success) => {
      console.log(`Logged in as ${success.user.email}`);
      this.setState({
          adminEmail: '',
          adminPwd: '',
          loggedIn: true,
          showLogin: false,
          loginErr: false
      });
    }).catch((error) => {
      this.setState({
        loginErr: true
      });
    });            
  }
  
  addPlayer(e) {
    e.preventDefault();
    this.dbRefNewUser = firebase.database().ref(`${this.state.playerName}/`)
    this.dbRefNewUser.set({
      playerName: this.state.playerName,
      teamName: this.state.teamName,
      countryShort: this.state.playerCountryShort,
      countryLong: this.state.playerCountryLong,
      mainShort: this.state.playerMainShort,
      mainLong: this.state.playerMainLong,
      ELO: 1200
    });
    this.setState({
      playerName: '',
      teamName: ''
    })
  }
  
  handleCountry(e) {
    let countryShort = e.target.value;
    countryShort = countryShort.toLowerCase();
    const countryLong = e.target.options[e.target.selectedIndex].text;
    this.setState({
      playerCountryShort: countryShort,
      playerCountryLong: countryLong
    });
  }

  handleMain(e) {
    const mainShort = e.target.value;
    const mainLong = e.target.options[e.target.selectedIndex].text;
    this.setState({
      playerMainShort: mainShort,
      playerMainLong: mainLong
    });
  }

  handleEmail(e) {
    const email = e.target.value;
    this.setState({
      adminEmail: email
    });
  }

  handlePwd(e) {
    const pwd = e.target.value;
    this.setState({
      adminPwd: pwd
    });
  }

  handleNewPlayer(e) {
    const playerName = e.target.value;
    this.setState({playerName: playerName});
  }

  handleShowELO() {
    this.setState({showAddELO: true});
  }

  handleCloseELO() {
    this.setState({showAddELO: false});
  }

  handleShowLogin() {
    this.setState({showLogin: true});
  }

  handleCloseLogin() {
    this.setState({showLogin: false});
  }

  handleShowUser() {
    this.setState({showAddUser: true});
  }

  handleCloseUser() {
    this.setState({showAddUser: false});
  }
  
  handlePlayerOne(e) {
    const playerName = e.target.value;
    this.setState({playerOne: playerName});
  }

  handlePlayerTwo(e) {
    const playerName = e.target.value;
    this.setState({playerTwo: playerName});
  }

  handleWinner(e) {
    const winner = e.target.value;
    this.setState({winner: winner});
  }
  
  handleTeam(e) {
    const team = e.target.value;
    this.setState({teamName: team});
  }

  calculateELO(e) {
    e.preventDefault();

    this.dbRefPlayerOne = firebase.database().ref(`${this.state.playerOne}/`);
    this.dbRefPlayerTwo = firebase.database().ref(`${this.state.playerTwo}/`);

    let playerOneOriginalELO = 1200;
    let playerTwoOriginalELO = 1200;

    this.dbRefPlayerOne.on('value', snapshot => {
      playerOneOriginalELO = snapshot.val().ELO;
    });

    this.dbRefPlayerTwo.on('value', snapshot => {
      playerTwoOriginalELO = snapshot.val().ELO;
    });

    const playerOneTransELO = Math.pow(10, playerOneOriginalELO / 400);
    const playerTwoTransELO = Math.pow(10, playerTwoOriginalELO / 400);

    const playerOneExpectedScore = playerOneTransELO / (playerOneTransELO + playerTwoTransELO);
    const playerTwoExpectedScore = playerTwoTransELO / (playerTwoTransELO + playerOneTransELO);

    const playerOneUpdatedELO = Math.round(playerOneOriginalELO + 32 * (1 - playerOneExpectedScore));
    const playerTwoUpdatedELO = Math.round(playerTwoOriginalELO + 32 * (0 - playerTwoExpectedScore));

    this.dbRefPlayerOne.update({
      ELO: playerOneUpdatedELO
    });

    this.dbRefPlayerTwo.update({
      ELO: playerTwoUpdatedELO
    });

    this.setState({
      playerOne: '',
      playerTwo: ''
    })
  }

  render() {
    return <div>
        {this.state.userLocale === 'eo' ?
          <div className="jumbotron text-center">
            <h1 className="page-header">{this.state.locale.eo.pageTitle}</h1>
            <p>{this.state.locale.eo.subHeading}</p>
          </div>
        : this.state.userLocale === 'ja' ?
          <div className="jumbotron text-center">
            <h1 className="page-header">{this.state.locale.ja.pageTitle}</h1>
            <p>{this.state.locale.ja.subHeading}</p>
          </div>
        : this.state.userLocale === 'ko' ?
          <div className="jumbotron text-center">
            <h1 className="page-header">{this.state.locale.ko.pageTitle}</h1>
            <p>{this.state.locale.ko.subHeading}</p>
          </div>
        : this.state.userLocale === 'zh-CN' ?
          <div className="jumbotron text-center">
            <h1 className="page-header">{this.state.locale.cn.pageTitle}</h1>
            <p>{this.state.locale.cn.subHeading}</p>
          </div>
        : this.state.userLocale === 'zh-HK' ?
          <div className="jumbotron text-center">
            <h1 className="page-header">{this.state.locale.hk.pageTitle}</h1>
            <p>{this.state.locale.hk.subHeading}</p>
          </div>
        : this.state.userLocale.startsWith('es') ?
          <div className="jumbotron text-center">
            <h1 className="page-header">{this.state.locale.es.pageTitle}</h1>
            <p>{this.state.locale.es.subHeading}</p>
          </div>
        : this.state.userLocale.startsWith('ru') ?
          <div className="jumbotron text-center">
            <h1 className="page-header">{this.state.locale.ru.pageTitle}</h1>
            <p>{this.state.locale.ru.subHeading}</p>
          </div>
        :
          <div className="jumbotron text-center">
            <h1 className="page-header">{this.state.locale.en.pageTitle}</h1>
            <p>{this.state.locale.en.subHeading}</p>
          </div>
        }
        <div className="container">
          <Table striped bordered>
            <thead className="thead-dark text-center">
              {this.state.userLocale === 'eo' ? 
                <tr>
                  <th>{this.state.locale.eo.rankTitle}</th>
                  <th className="player-name">{this.state.locale.eo.playerTitle}</th>
                  <th className="main-char">{this.state.locale.eo.characterTitle}</th>
                  <th className="score">{this.state.locale.eo.scoreTitle}</th>
                </tr> 
              : this.state.userLocale === 'ja' ?
                <tr>
                  <th className="ja-rank">{this.state.locale.ja.rankTitle}</th>
                  <th className="player-name">{this.state.locale.ja.playerTitle}</th>
                  <th className="main-char ja-main-char">{this.state.locale.ja.characterTitle}</th>
                  <th className="score ja-score">{this.state.locale.ja.scoreTitle}</th>
                </tr> 
              : this.state.userLocale === 'ko' ?
                <tr>
                  <th>{this.state.locale.ko.rankTitle}</th>
                  <th className="player-name">{this.state.locale.ko.playerTitle}</th>
                  <th className="main-char ko-main-char">{this.state.locale.ko.characterTitle}</th>
                  <th className="score ko-score">{this.state.locale.ko.scoreTitle}</th>
                </tr> 
              : this.state.userLocale === 'zh-CN' ?
                <tr>
                  <th>{this.state.locale.cn.rankTitle}</th>
                  <th className="player-name">{this.state.locale.cn.playerTitle}</th>
                  <th className="main-char zh-main-char">{this.state.locale.cn.characterTitle}</th>
                  <th className="score zh-score">{this.state.locale.cn.scoreTitle}</th>
                </tr> 
              : this.state.userLocale === 'zh-HK' ?
                <tr>
                  <th>{this.state.locale.hk.rankTitle}</th>
                  <th className="player-name">{this.state.locale.hk.playerTitle}</th>
                  <th className="main-char zh-main-char">{this.state.locale.hk.characterTitle}</th>
                  <th className="score zh-score">{this.state.locale.hk.scoreTitle}</th>
                </tr>
              : this.state.userLocale.startsWith('es') ?
                <tr>
                  <th>{this.state.locale.es.rankTitle}</th>
                  <th className="player-name">{this.state.locale.es.playerTitle}</th>
                  <th className="main-char">{this.state.locale.es.characterTitle}</th>
                  <th className="score">{this.state.locale.es.scoreTitle}</th>
                </tr>
              : this.state.userLocale.startsWith('ru') ?
                <tr>
                  <th>{this.state.locale.ru.rankTitle}</th>
                  <th className="player-name">{this.state.locale.ru.playerTitle}</th>
                  <th className="main-char">{this.state.locale.ru.characterTitle}</th>
                  <th className="score">{this.state.locale.ru.scoreTitle}</th>
                </tr>
              :
                <tr>
                  <th>{this.state.locale.en.rankTitle}</th>
                  <th className="player-name">{this.state.locale.en.playerTitle}</th>
                  <th className="main-char">{this.state.locale.en.characterTitle}</th>
                  <th className="score">{this.state.locale.en.scoreTitle}</th>
                </tr> 
              }
            </thead>
            <tbody>
              {this.state.rankings.map((player, index) => {
                return <PopulateRankings playerName={player.playerName} index={index} teamName={player.teamName} elo={player.ELO} countryShort={player.countryShort} countryLong={player.countryLong} mainShort={player.mainShort} mainLong={player.mainLong} twitterHandle={player.twitter} twitchChannel={player.twitch} key={index}/>
              })}
            </tbody>
          </Table>
        </div>
        <div className="container text-center">
          {this.state.loggedIn === false ? 
            <div>
              <Button className="btn-lg btn-primary" onClick={this.handleShowLogin}>
                Login
              </Button>
            </div>
          :
            <div>
              <Button className="btn-primary btn-lg add-match" onClick={this.handleShowELO}>
                Add Match
              </Button>
              <Button className="btn-lg" onClick={this.handleShowUser}>
                Add User
              </Button>
            </div>
          }
        </div>
        <Modal show={this.state.showLogin} onHide={this.handleCloseLogin}>
          <Modal.Header closeButton>
            <Modal.Title>
              Login
            </Modal.Title>
            <Modal.Body>
              {this.state.loginErr === true ?
                  <div className="alert alert-danger">
                    Invalid email or password!
                  </div>
                : null
              }
              <form>
                <div className="form-group">
                  <input type="text" className="form-control" value={this.state.adminEmail} onChange={this.handleEmail} placeholder="Email Address"/>
                </div>
                <div className="form-group">
                  <input type="password" className="form-control" value={this.state.adminPwd} onChange={this.handlePwd} placeholder="Password"/>
                </div>
                <div className="form-group text-center">
                  <Button type="submit" className="btn-primary btn-lg" onClick={this.doLogin}>
                    Login
                  </Button>
                </div>
              </form>
            </Modal.Body>
          </Modal.Header>
        </Modal>
        <Modal show={this.state.showAddUser} onHide={this.handleCloseUser}>
          <Modal.Header closeButton>
            <Modal.Title>
              Add User to Database
            </Modal.Title>
            <Modal.Body>
              <form>
                <div className="form-group">
                  <label>Player Name</label>
                  <input type="text" name="player-name" className="form-control" placeholder="(Do not include sponsor/team tag)" value={this.state.playerName} onChange={this.handleNewPlayer} />
                </div>
                <div className="form-group">
                  <label>Team Name</label>
                  <input type="text" name="team-name" className="form-control" placeholder="(Use shorthand version if available)" value={this.state.teamName} onChange={this.handleTeam} />
                </div>
                <div className="form-group">
                  <label>Country</label>
                  <select className="form-control" name="country" onChange={this.handleCountry}>
                    <option value="">--Please select a country--</option>
                    <option value="AF">Afghanistan</option>
                    <option value="AX">Åland Islands</option>
                    <option value="AL">Albania</option>
                    <option value="DZ">Algeria</option>
                    <option value="AS">American Samoa</option>
                    <option value="AD">Andorra</option>
                    <option value="AO">Angola</option>
                    <option value="AI">Anguilla</option>
                    <option value="AQ">Antarctica</option>
                    <option value="AG">Antigua and Barbuda</option>
                    <option value="AR">Argentina</option>
                    <option value="AM">Armenia</option>
                    <option value="AW">Aruba</option>
                    <option value="AU">Australia</option>
                    <option value="AT">Austria</option>
                    <option value="AZ">Azerbaijan</option>
                    <option value="BS">Bahamas</option>
                    <option value="BH">Bahrain</option>
                    <option value="BD">Bangladesh</option>
                    <option value="BB">Barbados</option>
                    <option value="BY">Belarus</option>
                    <option value="BE">Belgium</option>
                    <option value="BZ">Belize</option>
                    <option value="BJ">Benin</option>
                    <option value="BM">Bermuda</option>
                    <option value="BT">Bhutan</option>
                    <option value="BO">Bolivia</option>
                    <option value="BQ">Bonaire</option>
                    <option value="BA">Bosnia and Herzegovina</option>
                    <option value="BW">Botswana</option>
                    <option value="BV">Bouvet Island</option>
                    <option value="BR">Brazil</option>
                    <option value="IO">British Indian Ocean Territory</option>
                    <option value="BN">Brunei</option>
                    <option value="BG">Bulgaria</option>
                    <option value="BF">Burkina Faso</option>
                    <option value="BI">Burundi</option>
                    <option value="KH">Cambodia</option>
                    <option value="CM">Cameroon</option>
                    <option value="CA">Canada</option>
                    <option value="CV">Cape Verde</option>
                    <option value="KY">Cayman Islands</option>
                    <option value="CF">Central African Republic</option>
                    <option value="TD">Chad</option>
                    <option value="CL">Chile</option>
                    <option value="CN">China</option>
                    <option value="CX">Christmas Island</option>
                    <option value="CC">Cocos (Keeling) Islands</option>
                    <option value="CO">Colombia</option>
                    <option value="KM">Comoros</option>
                    <option value="CG">Congo</option>
                    <option value="CK">Cook Islands</option>
                    <option value="CR">Costa Rica</option>
                    <option value="CI">Côte d'Ivoire</option>
                    <option value="HR">Croatia</option>
                    <option value="CU">Cuba</option>
                    <option value="CW">Curaçao</option>
                    <option value="CY">Cyprus</option>
                    <option value="CZ">Czech Republic</option>
                    <option value="CD">Democratic Republic of Congo</option>
                    <option value="DK">Denmark</option>
                    <option value="DJ">Djibouti</option>
                    <option value="DM">Dominica</option>
                    <option value="DO">Dominican Republic</option>
                    <option value="EC">Ecuador</option>
                    <option value="EG">Egypt</option>
                    <option value="SV">El Salvador</option>
                    <option value="GQ">Equatorial Guinea</option>
                    <option value="ER">Eritrea</option>
                    <option value="EE">Estonia</option>
                    <option value="ET">Ethiopia</option>
                    <option value="FK">Falkland Islands (Malvinas)</option>
                    <option value="FO">Faroe Islands</option>
                    <option value="FJ">Fiji</option>
                    <option value="FI">Finland</option>
                    <option value="FR">France</option>
                    <option value="GF">French Guiana</option>
                    <option value="PF">French Polynesia</option>
                    <option value="TF">French Southern Territories</option>
                    <option value="GA">Gabon</option>
                    <option value="GM">Gambia</option>
                    <option value="GE">Georgia</option>
                    <option value="DE">Germany</option>
                    <option value="GH">Ghana</option>
                    <option value="GI">Gibraltar</option>
                    <option value="GR">Greece</option>
                    <option value="GL">Greenland</option>
                    <option value="GD">Grenada</option>
                    <option value="GP">Guadeloupe</option>
                    <option value="GU">Guam</option>
                    <option value="GT">Guatemala</option>
                    <option value="GG">Guernsey</option>
                    <option value="GN">Guinea</option>
                    <option value="GW">Guinea-Bissau</option>
                    <option value="GY">Guyana</option>
                    <option value="HT">Haiti</option>
                    <option value="HM">Heard Island and McDonald Islands</option>
                    <option value="VA">Holy See</option>
                    <option value="HN">Honduras</option>
                    <option value="HK">Hong Kong</option>
                    <option value="HU">Hungary</option>
                    <option value="IS">Iceland</option>
                    <option value="IN">India</option>
                    <option value="ID">Indonesia</option>
                    <option value="IR">Iran</option>
                    <option value="IQ">Iraq</option>
                    <option value="IE">Ireland</option>
                    <option value="IM">Isle of Man</option>
                    <option value="IL">Israel</option>
                    <option value="IT">Italy</option>
                    <option value="JM">Jamaica</option>
                    <option value="JP">Japan</option>
                    <option value="JE">Jersey</option>
                    <option value="JO">Jordan</option>
                    <option value="KZ">Kazakhstan</option>
                    <option value="KE">Kenya</option>
                    <option value="KI">Kiribati</option>
                    <option value="KW">Kuwait</option>
                    <option value="KG">Kyrgyzstan</option>
                    <option value="LA">Laos</option>
                    <option value="LV">Latvia</option>
                    <option value="LB">Lebanon</option>
                    <option value="LS">Lesotho</option>
                    <option value="LR">Liberia</option>
                    <option value="LY">Libya</option>
                    <option value="LI">Liechtenstein</option>
                    <option value="LT">Lithuania</option>
                    <option value="LU">Luxembourg</option>
                    <option value="MO">Macao</option>
                    <option value="MK">Macedonia</option>
                    <option value="MG">Madagascar</option>
                    <option value="MW">Malawi</option>
                    <option value="MY">Malaysia</option>
                    <option value="MV">Maldives</option>
                    <option value="ML">Mali</option>
                    <option value="MT">Malta</option>
                    <option value="MH">Marshall Islands</option>
                    <option value="MQ">Martinique</option>
                    <option value="MR">Mauritania</option>
                    <option value="MU">Mauritius</option>
                    <option value="YT">Mayotte</option>
                    <option value="MX">Mexico</option>
                    <option value="FM">Micronesia</option>
                    <option value="MD">Moldova</option>
                    <option value="MC">Monaco</option>
                    <option value="MN">Mongolia</option>
                    <option value="ME">Montenegro</option>
                    <option value="MS">Montserrat</option>
                    <option value="MA">Morocco</option>
                    <option value="MZ">Mozambique</option>
                    <option value="MM">Myanmar</option>
                    <option value="NA">Namibia</option>
                    <option value="NR">Nauru</option>
                    <option value="NP">Nepal</option>
                    <option value="NL">Netherlands</option>
                    <option value="NC">New Caledonia</option>
                    <option value="NZ">New Zealand</option>
                    <option value="NI">Nicaragua</option>
                    <option value="NE">Niger</option>
                    <option value="NG">Nigeria</option>
                    <option value="NU">Niue</option>
                    <option value="NF">Norfolk Island</option>
                    <option value="MP">Northern Mariana Islands</option>
                    <option value="KP">North Korea</option>
                    <option value="NO">Norway</option>
                    <option value="OM">Oman</option>
                    <option value="PK">Pakistan</option>
                    <option value="PW">Palau</option>
                    <option value="PS">Palestinian Territory, Occupied</option>
                    <option value="PA">Panama</option>
                    <option value="PG">Papua New Guinea</option>
                    <option value="PY">Paraguay</option>
                    <option value="PE">Peru</option>
                    <option value="PH">Philippines</option>
                    <option value="PN">Pitcairn</option>
                    <option value="PL">Poland</option>
                    <option value="PT">Portugal</option>
                    <option value="PR">Puerto Rico</option>
                    <option value="QA">Qatar</option>
                    <option value="RE">Réunion</option>
                    <option value="RO">Romania</option>
                    <option value="RU">Russian Federation</option>
                    <option value="RW">Rwanda</option>
                    <option value="BL">Saint Barthélemy</option>
                    <option value="SH">Saint Helena, Ascension and Tristan da Cunha</option>
                    <option value="KN">Saint Kitts and Nevis</option>
                    <option value="LC">Saint Lucia</option>
                    <option value="MF">Saint Martin</option>
                    <option value="PM">Saint Pierre and Miquelon</option>
                    <option value="VC">Saint Vincent and the Grenadines</option>
                    <option value="WS">Samoa</option>
                    <option value="SM">San Marino</option>
                    <option value="ST">Sao Tome and Principe</option>
                    <option value="SA">Saudi Arabia</option>
                    <option value="SN">Senegal</option>
                    <option value="RS">Serbia</option>
                    <option value="SC">Seychelles</option>
                    <option value="SL">Sierra Leone</option>
                    <option value="SG">Singapore</option>
                    <option value="SX">Sint Maarten (Dutch part)</option>
                    <option value="SK">Slovakia</option>
                    <option value="SI">Slovenia</option>
                    <option value="SB">Solomon Islands</option>
                    <option value="SO">Somalia</option>
                    <option value="ZA">South Africa</option>
                    <option value="GS">South Georgia and the South Sandwich Islands</option>
                    <option value="KR">South Korea</option>
                    <option value="SS">South Sudan</option>
                    <option value="ES">Spain</option>
                    <option value="LK">Sri Lanka</option>
                    <option value="SD">Sudan</option>
                    <option value="SR">Suriname</option>
                    <option value="SJ">Svalbard and Jan Mayen</option>
                    <option value="SZ">Swaziland</option>
                    <option value="SE">Sweden</option>
                    <option value="CH">Switzerland</option>
                    <option value="SY">Syria</option>
                    <option value="TW">Taiwan</option>
                    <option value="TJ">Tajikistan</option>
                    <option value="TZ">Tanzania</option>
                    <option value="TH">Thailand</option>
                    <option value="TL">Timor-Leste</option>
                    <option value="TG">Togo</option>
                    <option value="TK">Tokelau</option>
                    <option value="TO">Tonga</option>
                    <option value="TT">Trinidad and Tobago</option>
                    <option value="TN">Tunisia</option>
                    <option value="TR">Turkey</option>
                    <option value="TM">Turkmenistan</option>
                    <option value="TC">Turks and Caicos Islands</option>
                    <option value="TV">Tuvalu</option>
                    <option value="UG">Uganda</option>
                    <option value="UA">Ukraine</option>
                    <option value="AE">United Arab Emirates</option>
                    <option value="GB">United Kingdom</option>
                    <option value="US">United States</option>
                    <option value="UM">United States Minor Outlying Islands</option>
                    <option value="UY">Uruguay</option>
                    <option value="UZ">Uzbekistan</option>
                    <option value="VU">Vanuatu</option>
                    <option value="VE">Venezuela</option>
                    <option value="VN">Vietnam</option>
                    <option value="VG">Virgin Islands, British</option>
                    <option value="VI">Virgin Islands, U.S.</option>
                    <option value="WF">Wallis and Futuna</option>
                    <option value="EH">Western Sahara</option>
                    <option value="YE">Yemen</option>
                    <option value="ZM">Zambia</option>
                    <option value="ZW">Zimbabwe</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Main Character</label>
                  <select name="main-character" className="form-control" onChange={this.handleMain}>
                    <option value="">--Please select a character--</option>
                    <option value="moon">Sailor Moon</option>
                    <option value="venus">Sailor Venus</option>
                    <option value="mercury">Sailor Mercury</option>
                    <option value="mars">Sailor Mars</option>
                    <option value="jupiter">Sailor Jupiter</option>
                    <option value="uranus">Sailor Uranus</option>
                    <option value="neptune">Sailor Neptune</option>
                    <option value="pluto">Sailor Pluto</option>
                    <option value="chibi">Sailor Chibi Moon</option>
                  </select>
                </div>
                <div className="form-group text-center">
                  <Button type="submit" className="btn-primary btn-lg" onClick={this.addPlayer}>
                    Add User
                  </Button>
                </div>
              </form>
            </Modal.Body>
          </Modal.Header>
        </Modal>
        <Modal show={this.state.showAddELO} onHide={this.handleCloseELO}>
          <Modal.Header closeButton>
            <Modal.Title>
              Add Match to ELO
            </Modal.Title>
            <Modal.Body>
              <form>
                <div className="form-group">
                  <label htmlFor="player-one">Winner</label>
                  <input type="text" name="player-one" className="form-control" placeholder="(Do not include sponsor/team tag)" value={this.state.playerOne} onChange={this.handlePlayerOne}/>
                </div>
                <div className="form-group">
                  <label htmlFor="player-two">Loser</label>
                  <input type="text" name="player-two" className="form-control" placeholder="(Do not include sponsor/team tag)" value={this.state.playerTwo} onChange={this.handlePlayerTwo}/>
                </div>
                <div className="form-group text-center">
                  <Button type="submit" className="btn-primary btn-lg" onClick={this.calculateELO}>Submit</Button>
                  <Button className="btn-lg">Clear</Button>
                </div>
              </form>
            </Modal.Body>
          </Modal.Header>
        </Modal>
      </div>
  }
}

ReactDOM.render(<App />, document.getElementById('app'));
