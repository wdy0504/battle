var Player = function (opts) {
	this.name = opts.name;
	//���� 1:����;2:����
	this.type = opts.type || 1;
	//ս��λ��
	this.pos = opts.pos || 0;
	//ս��Ѫ��
	this.hp = opts.hp || 0;
	//ս��״̬
	this.battleStatus = opts.battleStatus || 0;
	//״̬
	this.status = opts.status || 0; //1:�޷���Ѫ
	//���Ѫ��
	this.maxHp = opts.hp || 0;
	//ս������
	this.fightAttri = new FightAttri(opts.fightAttri) || {};
	//���Ը���
	this.attriRate = new AttriRate(opts.attriRate) || {};
	//������
	this.skills = opts.skills || [];
	//�������
	this.skillPos = opts.skillPos || 0;
	//����
	this.pet = opts.pet || {};
	//���ϵ�buff
	this.buffs = opts.buffs || [];
	//���Ե�
	this.attriPoint = opts.buffs || 0;
	//��ǰ����
	this.exp = opts.exp || 0;
	//����
	this.str = opts.str || 0;
	//����
	this.con = opts.con || 0;
	//����
	this.dex = opts.dex || 0;
	//��־
	this.wil = opts.wil || 0;
	//����
	this.spi = opts.spi || 0;
};
//��ɫ����
var FightAttri = function (opts) {
	//������
	this.attack = opts.attack || 0;
	//����
	this.defend = opts.defend || 0;
	//�����˺�
	this.critHurt = opts.critHurt || 0;
	//����
	this.crit = opts.crit || 0;
	//����
	this.toughness = opts.toughness || 0;
	//����
	this.hit = opts.hit || 0;
	//����
	this.avoid = opts.avoid || 0;
	//����
	this.control =  opts.control || 0;
	//����
	this.resistance =  opts.resistance || 0;
	//���ӷ���
	this.reduceDefend = opts.reduceDefend || 0;
	//���ӷ����ٷֱ�
	this.reduceDefendPer = opts.reduceDefendPer || 0;
	//��Ѫ�ٷֱ�
	this.vampirePer = opts.vampirePer || 0;
	//ÿ�غϻ�Ѫ
	this.recoverHp = opts.recoverHp || 0;
	//�˺�����
	this.reduceDamagePer = opts.reduceDamagePer || 0;
	//�����˺�����
	this.reducePhysicalDamagePer = opts.reduceDamagePer || 0;
	//�����˺�����
	this.reduceSkillDamagePer = opts.reduceDamagePer || 0;
};
//��ɫ���Ը���
var AttriRate = function (opts) {
	//����������
	this.reduceArmorRate = opts.reduceArmorRate || 0;
	//������
	this.critRate = opts.critRate || 0;
	//������
	this.toughnessRate = opts.toughnessRate || 0;
	//������
	this.hitRate = opts.hitRate || 0;
	//������
	this.avoidRate = opts.avoidRate || 0;
};
function lvlup(p){
	p.maxHp +=3	
	p.fightAttri.attack += 2;
	p.fightAttri.hit += 1;
	p.fightAttri.avoid += 1;
	p.fightAttri.defend += 1;
	p.fightAttri.critHurt += 1;
	p.fightAttri.crit += 1;
	p.fightAttri.toughness += 1;
	p.fightAttri.control += 1;
	p.fightAttri.resistance += 1;
	p.attriPoint += 5;
}

function str(p, num){
	p.fightAttri.attack += num * 2;
	p.maxHp += num * 1;
}

function con(p, num){
	p.fightAttri.defend += num * 2;
	p.maxHp += num * 2;
}

function wil(p, num){
	p.fightAttri.critHurt += num * 1;
	p.fightAttri.crit += num * 3;
	p.fightAttri.resistance += 2;
}

function dex(p, num){
	p.fightAttri.avoid += num * 1;
	p.fightAttri.crit += num * 1;
}

function spi(p, num){
	p.fightAttri.attack += num * 1;
	p.fightAttri.cure += num * 1;
	p.fightAttri.resistance += num * 1;
	p.fightAttri.control += num * 2;
	p.maxHp += num * 1;
}