import { Component, OnInit } from '@angular/core';
import { Params } from './params';
import { Step } from './step';

@Component({
  selector: 'app-playfair',
  templateUrl: './playfair.component.html',
  styleUrls: ['./playfair.component.css']
})
export class PlayfairComponent {
  public params: Params = new Params();
  public letters: string[][] = [];
  public alphabet: string;
  public steps: Step[] = [];
  public submitted: boolean = false;
  public keyWithoutDuplicatesLength: number = 0;

  constructor() {
    this.setUpAlphabet();
    this.initLetters();
  }

  public onSubmit() {
    this.initLetters();
    this.submitted = true;
    if (this.params.text.length % 2 == 1) {
      this.params.text += 'V';
    }
    if (this.params.option == 'Encrypt') {
      this.encrypt();
    } else {
      this.decrypt();
    }
  }

  public checkIfHighligthOld(i: number, row: number, column: number) {
    if (this.steps[i].firstOldPos[0] == row && this.steps[i].firstOldPos[1] == column) {
      return true;
    }
    if (this.steps[i].secondOldPos[0] == row && this.steps[i].secondOldPos[1] == column) {
      return true;
    }
    return false;
  }

  public checkIfHighligthNew(i: number, row: number, column: number) {
    if (this.steps[i].firstNewPos[0] == row && this.steps[i].firstNewPos[1] == column) {
      return true;
    }
    if (this.steps[i].secondNewPos[0] == row && this.steps[i].secondNewPos[1] == column) {
      return true;
    }
    return false;
  }

  public checkIfHighligth(row: number, column: number) {
    if (this.keyWithoutDuplicatesLength > (row * 5) + column) {
      return true;
    }
    return false;
  }

  private initLetters() {
    this.letters = [];
    this.prepareAlphabet();
    for (let i = 0; i < 5; i++) {
      let row = [];
      for (let j = 0; j < 5; j++) {
        row.push(this.alphabet.charAt(i * 5 + j));
      }
      this.letters.push(row);
    }
  }

  private setUpAlphabet() {
    this.alphabet = "ABCDEFGHIKLMNOPQRSTUVWXYZ";
  }

  private prepareAlphabet() {
    this.setUpAlphabet();
    let keyWithoutDuplicates = "";
    let letter = "";
    if (this.params.key) {
      for (let i = 0; i < this.params.key.length; i++) {
        letter = this.params.key[i].toUpperCase();
        if (['I', 'J'].includes(letter)) {
          letter = 'I';
        }
        if (!keyWithoutDuplicates.includes(letter) && letter != ' ') {
          keyWithoutDuplicates += letter;
        }
      }
    }
    this.keyWithoutDuplicatesLength = keyWithoutDuplicates.length;
    let newAlphabet = keyWithoutDuplicates;
    for (let i = 0; i < this.alphabet.length; i++) {
      letter = this.alphabet[i].toUpperCase();
      if (['I', 'J'].includes(letter)) {
        letter = 'I';
      }
      if (!newAlphabet.includes(this.alphabet[i])) {
        newAlphabet += letter;
      }
    }
    this.alphabet = newAlphabet;

  }

  private encrypt() {
    this.params.result = "";
    this.steps = [];
    for (let i = 0; i < this.params.text.length; i += 2) {
      let step: Step;
      let first: number[] = this.getPosition(this.params.text[i]);
      let second: number[] = this.getPosition(this.params.text[i + 1]);
      if (first[0] == second[0]) {
        step = new Step(i / 2, first, [first[0], this.mod5(first[1] + 1)], second, [second[0], this.mod5(second[1] + 1)]);
        this.params.result += this.letters[first[0]][this.mod5(first[1] + 1)] + this.letters[second[0]][this.mod5(second[1] + 1)];
      } else if (first[1] == second[1]) {
        step = new Step(i / 2, first, [this.mod5(first[0] + 1), first[1]], second, [this.mod5(second[0] + 1), second[1]]);
        this.params.result += this.letters[this.mod5(first[0] + 1)][first[1]] + this.letters[this.mod5(second[0] + 1)][second[1]];
      } else {
        step = new Step(i / 2, first, [first[0], second[1]], second, [second[0], first[1]]);
        this.params.result += this.letters[first[0]][second[1]] + this.letters[second[0]][first[1]];
      }
      this.steps.push(step);
    }

  }

  private decrypt() {
    this.params.result = "";
    this.steps = [];
    for (let i = 0; i < this.params.text.length; i += 2) {
      let step: Step;
      let first: number[] = this.getPosition(this.params.text[i]);
      let second: number[] = this.getPosition(this.params.text[i + 1]);
      if (first[0] == second[0]) {
        step = new Step(i / 2, first, [first[0], this.mod5(first[1] - 1)], second, [second[0], this.mod5(second[1] - 1)]);
        this.params.result += this.letters[first[0]][this.mod5(first[1] - 1)] + this.letters[second[0]][this.mod5(second[1] - 1)];
      } else if (first[1] == second[1]) {
        step = new Step(i / 2, first, [this.mod5(first[0] - 1), first[1]], second, [this.mod5(second[0] - 1), second[1]]);
        this.params.result += this.letters[this.mod5(first[0] - 1)][first[1]] + this.letters[this.mod5(second[0] - 1)][second[1]];
      } else {
        step = new Step(i / 2, first, [first[0], second[1]], second, [second[0], first[1]]);
        this.params.result += this.letters[first[0]][second[1]] + this.letters[second[0]][first[1]];
      }
      this.steps.push(step);
    }
  }

  private mod5(n) {
    return ((n%5)+5)%5;
};
  private getPosition(c: string) {
    c = c.toUpperCase();
    if (c == ' ') {
      return this.getPosition('X');
    }
    if (c == 'J') {
      return this.getPosition('I');
    }
    for (let i = 0; i < 5; i++) {
      for (let j = 0; j < 5; j++) {
        if (this.letters[i][j] == c) {
          return [i, j];
        }
      }
    }
  }

}
