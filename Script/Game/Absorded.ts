import { _decorator, Component, Node, Vec3 } from 'cc';
import { CleanerHead } from '../CleanerConstruction/CleanerHead';
import { RubbishItem } from './RubbishItem';
import { WallRubbishItem } from './WallRubbishItem';
const { ccclass, property } = _decorator;

@ccclass('Absorded')
export class Absorded extends Component {

    /**被吸收到的点 */
    public target: Node = null

    private targetPoint: Node = null

    private directToTarget: Vec3 = new Vec3()

    private startDistant: number = 0

    private currentDistant: number = 0

    private worldScale: Vec3 = new Vec3()

    public itemLevel: number = 0

    private absordTime: number = 0

    start() {
        this.targetPoint = this.target.getComponent(CleanerHead).absordedPoint
        this.startDistant = Vec3.distance(this.node.worldPosition, this.targetPoint.worldPosition)
        this.worldScale = this.node.getWorldScale()
    }

    update(deltaTime: number) {
        this.absordTime += deltaTime
        this.currentDistant = Vec3.distance(this.node.worldPosition, this.targetPoint.worldPosition)
        Vec3.subtract(this.directToTarget, this.node.worldPosition, this.targetPoint.worldPosition)
        this.node.setWorldPosition(this.node.worldPosition.clone().add(this.directToTarget.normalize().multiplyScalar(-0.1 * this.startDistant)))
        if (this.worldScale.clone().multiplyScalar(this.currentDistant / this.startDistant).x < this.node.worldScale.clone().x) {
            this.node.setWorldScale(this.worldScale.clone().multiplyScalar(this.currentDistant / this.startDistant))
        }
        if (this.currentDistant <= 0.1 * this.itemLevel || this.absordTime >= 0.8) {
            this.target.getComponent(CleanerHead).collect(this.node)
            if (this.node.getComponent(RubbishItem) !== null) {
                this.node.getComponent(RubbishItem).destroySelf()
            }
            if (this.node.getComponent(WallRubbishItem) !== null) {
                this.node.getComponent(WallRubbishItem).destroySelf()
            }
        }
    }
}
