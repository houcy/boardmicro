var elf, header = {};
function readelfHeader(c) {
  elf = c;
  if (83 != (elf.charCodeAt(18) | elf.charCodeAt(19) << 8)) {
    throw "Architecture mismatch";
  }
  header.sectionHeaderOffset = elf.charCodeAt(32) | elf.charCodeAt(33) << 8;
  header.sectionHeaderSize = elf.charCodeAt(46) | elf.charCodeAt(47) << 8;
  header.sectionHeaderNum = elf.charCodeAt(48) | elf.charCodeAt(49) << 8;
  header.stringSectionIndex = elf.charCodeAt(50) | elf.charCodeAt(51) << 8;
}
var section = {};
function readelfSection(c) {
  for (var a = 0, f = 0, d = 0, g = header.sectionHeaderNum, b = header.sectionHeaderOffset + header.sectionHeaderSize * header.stringSectionIndex, b = (elf.charCodeAt(b + 18) | elf.charCodeAt(b + 19) << 8) << 16 | elf.charCodeAt(b + 16) | elf.charCodeAt(b + 17) << 8;g--;) {
    section.name = "";
    a = header.sectionHeaderOffset + header.sectionHeaderSize * f;
    d = (elf.charCodeAt(a + 2) | elf.charCodeAt(a + 3) << 8) << 16 | elf.charCodeAt(a) | elf.charCodeAt(a + 1) << 8;
    for (d = b + d;"\x00" != elf[d];) {
      section.name = section.name.concat(elf[d++]);
    }
    if (section.name == c) {
      break;
    }
    f++;
  }
  section.address = (elf.charCodeAt(a + 14) | elf.charCodeAt(a + 15) << 8) << 16 | elf.charCodeAt(a + 12) | elf.charCodeAt(a + 13) << 8;
  section.fileOffset = (elf.charCodeAt(a + 18) | elf.charCodeAt(a + 19) << 8) << 16 | elf.charCodeAt(a + 16) | elf.charCodeAt(a + 17) << 8;
  section.Size = (elf.charCodeAt(a + 22) | elf.charCodeAt(a + 23) << 8) << 16 | elf.charCodeAt(a + 20) | elf.charCodeAt(a + 21) << 8;
}
function getHexFromSection() {
  for (var c = "", a = "", f = 0, d = section.Size;0 < d;) {
    for (var g = 16 <= d ? 16 : d, a = ":" + ("0" + g.toString(16)).substr(-2).toUpperCase(), a = a + ("000" + (section.address + f).toString(16)).substr(-4).toUpperCase(), a = a + "00", b = 0, e = 0;e < g;e++) {
      b = elf.charCodeAt(section.fileOffset + f), a += ("0" + b.toString(16)).substr(-2).toUpperCase(), f++;
    }
    d -= g;
    b = 0;
    for (e = 1;e < 2 * g + 8;e += 2) {
      b += parseInt(a.substr(e, 2), 16);
    }
    b = ~b;
    b++;
    b &= 255;
    a += ("0" + b.toString(16)).substr(-2).toUpperCase();
    a += "\n";
    c += a;
  }
  return c;
}
function getHexFromElf(c) {
  readelfHeader(c);
  readelfSection(".text");
  c = getHexFromSection();
  var a = section.Size;
  readelfSection(".data");
  section.address = a;
  c += getHexFromSection();
  return c + ":00000001FF";
}
;