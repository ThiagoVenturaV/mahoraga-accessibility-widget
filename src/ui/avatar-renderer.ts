import { AvatarType } from '../types';
import { store } from '../state/store';

export class AvatarRenderer {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private animFrameId: number | null = null;
  private avatar: AvatarType = 'HUGO';

  // Animation state
  private time = 0;
  private blinkTime = 0;
  private isBlinking = false;
  private headY = 0;
  private handLeftX = 0;
  private handLeftY = 0;
  private handRightX = 0;
  private handRightY = 0;
  private isSigning = false;
  private signProgress = 0;
  private signDuration = 180; // frames
  private signSequence: Array<{ leftHand: [number, number]; rightHand: [number, number]; label: string }> = [];
  private onFinishCallback?: () => void;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    const context = canvas.getContext('2d');
    if (!context) throw new Error('Não foi possível obter contexto 2D para o avatar.');
    this.ctx = context;

    this.resize();
    this.startLoop();

    store.subscribe((state) => {
      this.avatar = state.avatar;
    });
  }

  public resize() {
    const rect = this.canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    this.canvas.width = (rect.width || 320) * dpr;
    this.canvas.height = (rect.height || 360) * dpr;
    this.ctx.scale(dpr, dpr);
  }

  public sign(text: string, onFinish?: () => void) {
    this.isSigning = true;
    this.signProgress = 0;
    this.onFinishCallback = onFinish;

    // Generate Libras sign keyframe gestures based on words or characters
    const words = text.toLowerCase().replace(/[.,!?;:]/g, '').split(/\s+/).filter(Boolean);
    this.signSequence = [];

    words.forEach((word) => {
      if (word === 'olá' || word === 'oi') {
        this.signSequence.push(
          { leftHand: [-30, 20], rightHand: [45, -70], label: 'Olá!' },
          { leftHand: [-30, 20], rightHand: [65, -75], label: 'Olá!' },
          { leftHand: [-30, 20], rightHand: [45, -70], label: 'Olá!' }
        );
      } else if (word === 'libras') {
        this.signSequence.push(
          { leftHand: [-30, -50], rightHand: [30, -50], label: 'Libras' },
          { leftHand: [-50, -40], rightHand: [50, -40], label: 'Libras' },
          { leftHand: [-25, -55], rightHand: [25, -55], label: 'Libras' }
        );
      } else if (word === 'obrigado') {
        this.signSequence.push(
          { leftHand: [-20, 10], rightHand: [15, -85], label: 'Obrigado' },
          { leftHand: [-20, 10], rightHand: [5, -35], label: 'Obrigado' }
        );
      } else if (word === 'acessibilidade') {
        this.signSequence.push(
          { leftHand: [-40, -40], rightHand: [40, -40], label: 'Acessibilidade' },
          { leftHand: [-10, -50], rightHand: [10, -50], label: 'Acessibilidade' },
          { leftHand: [-50, -30], rightHand: [50, -30], label: 'Acessibilidade' }
        );
      } else {
        // Datilologia (fingerspelling)
        for (let i = 0; i < Math.min(word.length, 4); i++) {
          const offset = (i % 2 === 0 ? 1 : -1) * 15;
          this.signSequence.push({
            leftHand: [-25 + offset, 0],
            rightHand: [30 + offset, -45 - i * 5],
            label: word.toUpperCase()
          });
        }
      }
    });

    if (this.signSequence.length === 0) {
      this.signSequence.push({ leftHand: [-20, 10], rightHand: [20, 10], label: '' });
    }

    const speed = store.getState().speed;
    this.signDuration = Math.max(60, (this.signSequence.length * 40) / speed);
  }

  public stop() {
    this.isSigning = false;
    this.signProgress = 0;
    this.signSequence = [];
    this.onFinishCallback?.();
  }

  private startLoop() {
    const loop = () => {
      this.update();
      this.render();
      this.animFrameId = requestAnimationFrame(loop);
    };
    this.animFrameId = requestAnimationFrame(loop);
  }

  private update() {
    this.time += 0.04;

    // Natural blinking
    this.blinkTime += 1;
    if (this.blinkTime > 160) {
      this.isBlinking = true;
      if (this.blinkTime > 172) {
        this.isBlinking = false;
        this.blinkTime = 0;
      }
    }

    // Natural breathing / idle motion
    this.headY = Math.sin(this.time) * 3;

    if (this.isSigning && this.signSequence.length > 0) {
      const speed = store.getState().speed;
      this.signProgress += (1 / this.signDuration) * speed;

      if (this.signProgress >= 1) {
        this.isSigning = false;
        this.signProgress = 0;
        this.onFinishCallback?.();
      } else {
        const step = this.signProgress * (this.signSequence.length - 1);
        const index = Math.floor(step);
        const nextIndex = Math.min(index + 1, this.signSequence.length - 1);
        const fraction = step - index;

        const curr = this.signSequence[index];
        const next = this.signSequence[nextIndex];

        // Smooth gesture interpolation
        this.handLeftX = curr.leftHand[0] + (next.leftHand[0] - curr.leftHand[0]) * fraction;
        this.handLeftY = curr.leftHand[1] + (next.leftHand[1] - curr.leftHand[1]) * fraction;
        this.handRightX = curr.rightHand[0] + (next.rightHand[0] - curr.rightHand[0]) * fraction;
        this.handRightY = curr.rightHand[1] + (next.rightHand[1] - curr.rightHand[1]) * fraction;
      }
    } else {
      // Idle hand position
      this.handLeftX = -35 + Math.sin(this.time * 0.8) * 3;
      this.handLeftY = 20 + Math.cos(this.time * 0.8) * 2;
      this.handRightX = 35 - Math.sin(this.time * 0.8) * 3;
      this.handRightY = 20 + Math.cos(this.time * 0.8) * 2;
    }
  }

  private render() {
    const width = this.canvas.width / (window.devicePixelRatio || 1);
    const height = this.canvas.height / (window.devicePixelRatio || 1);
    const cx = width / 2;
    const cy = height * 0.52;

    this.ctx.clearRect(0, 0, width, height);

    // Subtle 3D studio background lighting
    const bgGrad = this.ctx.createRadialGradient(cx, cy - 20, 30, cx, cy, width * 0.7);
    bgGrad.addColorStop(0, this.avatar === 'HUGO' ? 'rgba(0, 132, 255, 0.08)' : 'rgba(156, 39, 176, 0.08)');
    bgGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    this.ctx.fillStyle = bgGrad;
    this.ctx.fillRect(0, 0, width, height);

    this.ctx.save();
    this.ctx.translate(cx, cy + this.headY);

    // Render 3D-styled stylized avatar
    this.drawBody();
    this.drawNeck();
    this.drawHead();
    this.drawArmsAndHands();

    this.ctx.restore();
  }

  private drawBody() {
    const isHugo = this.avatar === 'HUGO';
    const shirtColor = isHugo ? '#0070f3' : '#7928ca';
    const shirtHighlight = isHugo ? '#3291ff' : '#9e46f7';
    const shirtShadow = isHugo ? '#004fc5' : '#57189a';

    // Torso / Shirt
    this.ctx.beginPath();
    this.ctx.moveTo(-60, 40);
    this.ctx.quadraticCurveTo(-75, 140, -85, 180);
    this.ctx.lineTo(85, 180);
    this.ctx.quadraticCurveTo(75, 140, 60, 40);
    this.ctx.closePath();

    const bodyGrad = this.ctx.createLinearGradient(-60, 40, 60, 180);
    bodyGrad.addColorStop(0, shirtHighlight);
    bodyGrad.addColorStop(0.4, shirtColor);
    bodyGrad.addColorStop(1, shirtShadow);
    this.ctx.fillStyle = bodyGrad;
    this.ctx.fill();

    // Collar / neckline
    this.ctx.beginPath();
    this.ctx.moveTo(-22, 40);
    this.ctx.quadraticCurveTo(0, 62, 22, 40);
    this.ctx.lineWidth = 4;
    this.ctx.strokeStyle = isHugo ? '#ffffff' : '#f0d9ff';
    this.ctx.stroke();

    // Logo on chest (Hand Talk sign hand emblem)
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    this.ctx.beginPath();
    this.ctx.arc(28, 90, 7, 0, Math.PI * 2);
    this.ctx.fill();
  }

  private drawNeck() {
    const skinColor = this.avatar === 'HUGO' ? '#f8c291' : '#fbc5a8';
    const skinShadow = this.avatar === 'HUGO' ? '#e59866' : '#e09f80';

    this.ctx.beginPath();
    this.ctx.rect(-16, 12, 32, 32);
    const neckGrad = this.ctx.createLinearGradient(-16, 12, 16, 44);
    neckGrad.addColorStop(0, skinShadow);
    neckGrad.addColorStop(1, skinColor);
    this.ctx.fillStyle = neckGrad;
    this.ctx.fill();
  }

  private drawHead() {
    const isHugo = this.avatar === 'HUGO';
    const skinColor = isHugo ? '#fcd6b5' : '#fde2cf';
    const skinHighlight = '#fff0e5';
    const skinShadow = isHugo ? '#e8a980' : '#e2ab90';
    const hairColor = isHugo ? '#3d2314' : '#2b1b17';

    // Maya's high ponytail in background
    if (!isHugo) {
      this.ctx.beginPath();
      this.ctx.moveTo(35, -45);
      this.ctx.quadraticCurveTo(70, -60, 75, -20);
      this.ctx.quadraticCurveTo(80, 25, 45, 10);
      this.ctx.closePath();
      this.ctx.fillStyle = hairColor;
      this.ctx.fill();
    }

    // Head base (oval)
    this.ctx.beginPath();
    this.ctx.ellipse(0, -25, 44, 52, 0, 0, Math.PI * 2);
    const headGrad = this.ctx.createRadialGradient(-10, -35, 10, 0, -25, 50);
    headGrad.addColorStop(0, skinHighlight);
    headGrad.addColorStop(0.5, skinColor);
    headGrad.addColorStop(1, skinShadow);
    this.ctx.fillStyle = headGrad;
    this.ctx.shadowColor = 'rgba(0,0,0,0.15)';
    this.ctx.shadowBlur = 10;
    this.ctx.shadowOffsetY = 4;
    this.ctx.fill();
    this.ctx.shadowColor = 'transparent';

    // Ears
    this.drawEar(-45, -25, skinColor);
    this.drawEar(45, -25, skinColor);

    // Hair
    this.ctx.fillStyle = hairColor;
    if (isHugo) {
      // Hugo's stylish modern haircut
      this.ctx.beginPath();
      this.ctx.moveTo(-44, -35);
      this.ctx.quadraticCurveTo(-46, -75, 0, -82);
      this.ctx.quadraticCurveTo(46, -78, 44, -35);
      this.ctx.quadraticCurveTo(35, -55, 15, -60);
      this.ctx.quadraticCurveTo(-15, -65, -44, -35);
      this.ctx.closePath();
      this.ctx.fill();
    } else {
      // Maya's stylish hair with bangs
      this.ctx.beginPath();
      this.ctx.moveTo(-45, -25);
      this.ctx.quadraticCurveTo(-48, -75, 0, -80);
      this.ctx.quadraticCurveTo(48, -75, 45, -25);
      this.ctx.quadraticCurveTo(30, -50, 0, -52);
      this.ctx.quadraticCurveTo(-30, -50, -45, -25);
      this.ctx.closePath();
      this.ctx.fill();
    }

    // Eyes
    this.drawEye(-18, -25);
    this.drawEye(18, -25);

    // Eyebrows
    this.ctx.strokeStyle = hairColor;
    this.ctx.lineWidth = 3;
    this.ctx.lineCap = 'round';
    this.ctx.beginPath();
    this.ctx.moveTo(-28, -38);
    this.ctx.quadraticCurveTo(-18, -42, -8, -38);
    this.ctx.stroke();

    this.ctx.beginPath();
    this.ctx.moveTo(8, -38);
    this.ctx.quadraticCurveTo(18, -42, 28, -38);
    this.ctx.stroke();

    // Nose
    this.ctx.strokeStyle = skinShadow;
    this.ctx.lineWidth = 2.5;
    this.ctx.beginPath();
    this.ctx.moveTo(0, -22);
    this.ctx.lineTo(2, -10);
    this.ctx.lineTo(-4, -8);
    this.ctx.stroke();

    // Friendly Smiling Mouth
    this.ctx.beginPath();
    if (this.isSigning) {
      // Active facial articulation for Libras phonology
      this.ctx.ellipse(0, 5, 8, 5, 0, 0, Math.PI * 2);
      this.ctx.fillStyle = '#b71c1c';
      this.ctx.fill();
    } else {
      this.ctx.arc(0, -2, 14, 0.25 * Math.PI, 0.75 * Math.PI);
      this.ctx.lineWidth = 3;
      this.ctx.strokeStyle = '#c2185b';
      this.ctx.stroke();
    }
  }

  private drawEar(x: number, y: number, color: string) {
    this.ctx.beginPath();
    this.ctx.ellipse(x, y, 7, 12, 0, 0, Math.PI * 2);
    this.ctx.fillStyle = color;
    this.ctx.fill();
  }

  private drawEye(x: number, y: number) {
    if (this.isBlinking) {
      this.ctx.beginPath();
      this.ctx.moveTo(x - 8, y);
      this.ctx.lineTo(x + 8, y);
      this.ctx.lineWidth = 2.5;
      this.ctx.strokeStyle = '#2b1b17';
      this.ctx.stroke();
      return;
    }

    // Sclera
    this.ctx.beginPath();
    this.ctx.ellipse(x, y, 9, 7, 0, 0, Math.PI * 2);
    this.ctx.fillStyle = '#ffffff';
    this.ctx.fill();

    // Iris (expressive friendly brown/hazel)
    this.ctx.beginPath();
    this.ctx.arc(x, y, 5, 0, Math.PI * 2);
    this.ctx.fillStyle = this.avatar === 'HUGO' ? '#5d4037' : '#4e342e';
    this.ctx.fill();

    // Pupil
    this.ctx.beginPath();
    this.ctx.arc(x, y, 2.5, 0, Math.PI * 2);
    this.ctx.fillStyle = '#000000';
    this.ctx.fill();

    // Eye highlight gleam
    this.ctx.beginPath();
    this.ctx.arc(x - 2, y - 2, 1.8, 0, Math.PI * 2);
    this.ctx.fillStyle = '#ffffff';
    this.ctx.fill();
  }

  private drawArmsAndHands() {
    const skinColor = this.avatar === 'HUGO' ? '#fcd6b5' : '#fde2cf';

    // Left Arm & Hand
    this.drawLibrasHand(-55, 60, this.handLeftX, this.handLeftY, skinColor, true);

    // Right Arm & Hand
    this.drawLibrasHand(55, 60, this.handRightX, this.handRightY, skinColor, false);
  }

  private drawLibrasHand(shoulderX: number, shoulderY: number, targetX: number, targetY: number, skinColor: string, isLeft: boolean) {
    const elbowX = (shoulderX + targetX) / 2 + (isLeft ? -15 : 15);
    const elbowY = (shoulderY + targetY) / 2 + 10;

    // Forearm
    this.ctx.beginPath();
    this.ctx.moveTo(shoulderX, shoulderY);
    this.ctx.quadraticCurveTo(elbowX, elbowY, targetX, targetY);
    this.ctx.lineWidth = 14;
    this.ctx.lineCap = 'round';
    this.ctx.strokeStyle = skinColor;
    this.ctx.stroke();

    // Hand palm & expressive Libras fingers
    this.ctx.save();
    this.ctx.translate(targetX, targetY);

    // Palm
    this.ctx.beginPath();
    this.ctx.arc(0, 0, 11, 0, Math.PI * 2);
    this.ctx.fillStyle = skinColor;
    this.ctx.fill();

    // Fingers
    const fingerAngle = isLeft ? -0.4 : 0.4;
    for (let f = -2; f <= 2; f++) {
      this.ctx.beginPath();
      this.ctx.moveTo(f * 3.5, 0);
      const angle = fingerAngle + f * 0.15;
      const length = 12 + Math.cos(f) * 4;
      this.ctx.lineTo(f * 3.5 + Math.sin(angle) * length, -Math.cos(angle) * length);
      this.ctx.lineWidth = 4;
      this.ctx.lineCap = 'round';
      this.ctx.strokeStyle = skinColor;
      this.ctx.stroke();
    }

    this.ctx.restore();
  }

  public destroy() {
    if (this.animFrameId) {
      cancelAnimationFrame(this.animFrameId);
    }
  }
}
